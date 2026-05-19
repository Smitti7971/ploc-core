# ⚖️ Offline Capabilities & PWA Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform the Ploc web app into an offline-first Progressive Web App (PWA) that loads instantly without internet access, caches gameplay state locally, and automatically synchronizes offline progress with the backend once connection is restored.

**Architecture:** We use a decoupled Service Worker for resource caching and an event-driven `OfflineSyncEngine` to manage data consistency. Offline gameplay actions (like bubble pops, scores, and attributes) are intercepted, safely queued in `localStorage`, and synced via a transactional queuing mechanism when the browser fires the `online` event.

**Tech Stack:** Next.js PWA configuration, Service Workers API, Custom React State hooks, Web Locks API, and standard LocalStorage/IndexedDB buffer layers.

---

## 📚 Introdução: O que é e Como Funciona o Modo Offline (Para Humanos)?

Se você não entende nada de desenvolvimento offline, não se preocupe! Aqui está uma explicação simples e clara do que vamos construir:

1. **O Porteiro do Prédio (Service Worker):**
   Normalmente, quando você entra em um site, seu navegador bate na porta dos servidores da internet para pedir os arquivos (páginas, imagens, scripts). Se você estiver sem internet, você dá de cara com uma porta fechada (tela de "Sem Internet").
   Nós vamos colocar um "porteiro" dentro do seu celular ou computador (chamado **Service Worker**). Na primeira vez que você acessar com internet, ele salva uma cópia de todos os arquivos importantes. Da próxima vez, mesmo com a internet desligada, o "porteiro" te entrega as páginas salvas na hora!

2. **A Caixa de Correio de Saída (Fila de Sincronização):**
   Se você estiver offline e estourar bolhas no jogo do Ploc, seu progresso não pode ser enviado na hora para o banco de dados. 
   Em vez de dar erro ou travar, o app vai guardar suas ações em uma "caixa de correio local" (`localStorage`). Toda vez que você pontuar, a caixa guarda: *"O usuário ganhou +1 em Corpo"*.

3. **O Entregador Automático (Sincronização Online):**
   O aplicativo fica monitorando a internet silenciosamente. Assim que o navegador disser *"Olha, a internet voltou!"*, nosso app abre a "caixa de correio local", envia todas as ações guardadas em lote para a nossa API na nuvem e atualiza seu perfil real. Você não perde nem um único ponto de progresso!

---

## 🛠️ Tasks de Implementação Passo a Passo

### Task 1: Configuração do PWA e manifesto no Next.js

**Files:**
- Create: `apps/web/public/manifest.json`
- Create: `apps/web/public/sw-register.js`
- Modify: `apps/web/app/layout.tsx`

**Step 1: Criar o arquivo `manifest.json` com os metadados do PWA**
```json
{
  "name": "Ploc - Equilíbrio Existencial",
  "short_name": "Ploc",
  "description": "Alcance o equilíbrio entre Corpo, Mente, Vida, Liberdade e Propósito.",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#090d16",
  "theme_color": "#090d16",
  "orientation": "portrait-primary",
  "icons": [
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}
```

**Step 2: Criar o script de registro `sw-register.js`**
```javascript
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((reg) => console.log('✅ Service Worker registrado com sucesso:', reg.scope))
      .catch((err) => console.error('❌ Falha ao registrar Service Worker:', err));
  });
}
```

**Step 3: Modificar `apps/web/app/layout.tsx` para carregar o manifesto e o script do SW**
Adicionar as tags `<link rel="manifest" href="/manifest.json" />` e o script `<script src="/sw-register.js" defer />` no `<head>` da aplicação.

**Step 4: Commit**
```bash
git add apps/web/public/manifest.json apps/web/public/sw-register.js apps/web/app/layout.tsx
git commit -m "feat: setup basic PWA configurations and service worker register script"
```

---

### Task 2: Implementação do Service Worker Local (`sw.js`)

**Files:**
- Create: `apps/web/public/sw.js`

**Step 1: Criar o script do Service Worker para cachear recursos estáticos**
```javascript
const CACHE_NAME = 'ploc-cache-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/manifest.json',
  '/sw-register.js',
  '/favicon.ico'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Ignora chamadas de API ou de terceiros no cache do Service Worker
  if (event.request.url.includes('/api/') || event.request.url.includes('/ai/')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return networkResponse;
      }).catch(() => {
        // Fallback offline se recurso não for encontrado no cache
        return caches.match('/');
      });
    })
  );
});
```

**Step 2: Commit**
```bash
git add apps/web/public/sw.js
git commit -m "feat: implement static assets service worker caching mechanism"
```

---

### Task 3: Criação da Engine de Sincronização Offline (`OfflineSyncEngine.ts`)

**Files:**
- Create: `apps/web/modules/blackboard/engine/sync/OfflineSyncEngine.ts`

**Step 1: Implementar o motor de sincronização**
```typescript
import { blackboardEventBus, BLACKBOARD_EVENTS } from '../../events/eventBus';

export interface QueuedAction {
  id: string;
  type: 'score_update' | 'attribute_change' | 'onboarding_complete';
  payload: any;
  timestamp: number;
}

class OfflineSyncEngine {
  private queue: QueuedAction[] = [];
  private isOnlineStatus: boolean = true;

  constructor() {
    if (typeof window !== 'undefined') {
      this.isOnlineStatus = navigator.onLine;
      this.loadQueue();

      window.addEventListener('online', () => this.handleNetworkChange(true));
      window.addEventListener('offline', () => this.handleNetworkChange(false));

      // Escuta eventos de pontuação para enfileirar em caso offline
      blackboardEventBus.subscribe(BLACKBOARD_EVENTS.ATTRIBUTE_CHANGED, (change: any) => {
        if (!this.isOnlineStatus) {
          this.enqueueAction('attribute_change', change);
        }
      });
    }
  }

  private loadQueue() {
    const saved = localStorage.getItem('ploc_offline_queue');
    if (saved) {
      try {
        this.queue = JSON.parse(saved);
      } catch (e) {
        this.queue = [];
      }
    }
  }

  private saveQueue() {
    localStorage.setItem('ploc_offline_queue', JSON.stringify(this.queue));
  }

  public isOnline(): boolean {
    return this.isOnlineStatus;
  }

  public enqueueAction(type: QueuedAction['type'], payload: any) {
    const action: QueuedAction = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      payload,
      timestamp: Date.now()
    };
    this.queue.push(action);
    this.saveQueue();
    console.log(`📦 [OfflineSyncEngine] Ação salva na fila local offline:`, action);
    
    // Dispara evento avisando a UI
    window.dispatchEvent(new CustomEvent('ploc_offline_action_queued', { detail: action }));
  }

  private async handleNetworkChange(online: boolean) {
    this.isOnlineStatus = online;
    console.log(`🌐 [OfflineSyncEngine] Conectividade alterada: ${online ? 'ONLINE' : 'OFFLINE'}`);
    
    window.dispatchEvent(new CustomEvent('ploc_network_status_changed', { detail: { online } }));

    if (online && this.queue.length > 0) {
      await this.syncQueueWithBackend();
    }
  }

  private async syncQueueWithBackend() {
    console.log(`🚀 [OfflineSyncEngine] Iniciando sincronização em lote de ${this.queue.length} ações...`);
    window.dispatchEvent(new CustomEvent('ploc_sync_started'));

    // Copia e limpa a fila para evitar duplicidades
    const actionsToSync = [...this.queue];
    
    try {
      // Simula ou realiza a chamada em lote para a nossa API
      // Substituir pelo endpoint correto futuramente
      const response = await fetch('/api/user/sync-actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ actions: actionsToSync })
      });

      if (response.ok) {
        console.log('✅ [OfflineSyncEngine] Sincronização concluída com sucesso!');
        this.queue = [];
        this.saveQueue();
        window.dispatchEvent(new CustomEvent('ploc_sync_success'));
      } else {
        throw new Error('Falha no processamento do servidor');
      }
    } catch (err) {
      console.error('❌ [OfflineSyncEngine] Erro na sincronização, as ações serão retidas para a próxima tentativa:', err);
      window.dispatchEvent(new CustomEvent('ploc_sync_failed'));
    }
  }
}

export const offlineSyncEngine = new OfflineSyncEngine();
```

**Step 2: Commit**
```bash
git add apps/web/modules/blackboard/engine/sync/OfflineSyncEngine.ts
git commit -m "feat: implement main OfflineSyncEngine for buffering and queuing offline actions"
```

---

### Task 4: Criar Componente Visual de Status de Conectividade (`NetworkIndicator.tsx`)

**Files:**
- Create: `apps/web/components/mascot/NetworkIndicator.tsx`
- Modify: `apps/web/app/LandingClient.tsx` (ou componente shell correspondente)

**Step 1: Criar o componente visual de aviso offline/sincronizando**
```tsx
'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff, Wifi, RefreshCw } from 'lucide-react';
import { offlineSyncEngine } from '@/modules/blackboard/engine/sync/OfflineSyncEngine';

export function NetworkIndicator() {
  const [isOnline, setIsOnline] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showSyncSuccess, setShowSyncSuccess] = useState(false);

  useEffect(() => {
    setIsOnline(offlineSyncEngine.isOnline());

    const handleNetwork = (e: Event) => {
      const customEvent = e as CustomEvent;
      setIsOnline(customEvent.detail.online);
    };

    const handleSyncStarted = () => setIsSyncing(true);
    const handleSyncSuccess = () => {
      setIsSyncing(false);
      setShowSyncSuccess(true);
      setTimeout(() => setShowSyncSuccess(false), 3000);
    };
    const handleSyncFailed = () => setIsSyncing(false);

    window.addEventListener('ploc_network_status_changed', handleNetwork);
    window.addEventListener('ploc_sync_started', handleSyncStarted);
    window.addEventListener('ploc_sync_success', handleSyncSuccess);
    window.addEventListener('ploc_sync_failed', handleSyncFailed);

    return () => {
      window.removeEventListener('ploc_network_status_changed', handleNetwork);
      window.removeEventListener('ploc_sync_started', handleSyncStarted);
      window.removeEventListener('ploc_sync_success', handleSyncSuccess);
      window.removeEventListener('ploc_sync_failed', handleSyncFailed);
    };
  }, []);

  return (
    <AnimatePresence>
      {/* ── 1. Caso Offline ── */}
      {!isOnline && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-[999999] flex items-center gap-3 bg-red-950/40 border border-red-500/30 text-red-200 px-5 py-2.5 rounded-full backdrop-blur-[12px] shadow-[0_8px_32px_rgba(239,68,68,0.2)] text-xs font-medium tracking-wide"
        >
          <WifiOff size={14} className="animate-pulse" />
          <span>Você está offline. Progresso sendo guardado localmente.</span>
        </motion.div>
      )}

      {/* ── 2. Caso Sincronizando ── */}
      {isSyncing && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-[999999] flex items-center gap-3 bg-sky-950/40 border border-sky-500/30 text-sky-200 px-5 py-2.5 rounded-full backdrop-blur-[12px] shadow-[0_8px_32px_rgba(56,189,248,0.2)] text-xs font-medium tracking-wide"
        >
          <RefreshCw size={14} className="animate-spin" />
          <span>Sincronizando seu progresso com a nuvem...</span>
        </motion.div>
      )}

      {/* ── 3. Caso Sincronizado com Sucesso ── */}
      {showSyncSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-[999999] flex items-center gap-3 bg-emerald-950/40 border border-emerald-500/30 text-emerald-200 px-5 py-2.5 rounded-full backdrop-blur-[12px] shadow-[0_8px_32px_rgba(16,185,129,0.2)] text-xs font-medium tracking-wide"
        >
          <Wifi size={14} />
          <span>Progresso sincronizado com sucesso! ⚖️</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

**Step 2: Inserir `<NetworkIndicator />` no `LandingClient.tsx`**
Abrir o arquivo `apps/web/app/LandingClient.tsx` e injetar o `<NetworkIndicator />` logo no início da árvore DOM do cliente.

**Step 3: Commit**
```bash
git add apps/web/components/mascot/NetworkIndicator.tsx apps/web/app/LandingClient.tsx
git commit -m "feat: add NetworkIndicator notification UI with offline and syncing status"
```
