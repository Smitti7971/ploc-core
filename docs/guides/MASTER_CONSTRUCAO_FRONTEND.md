# GUIA MESTRE: Construção de Páginas (Frontend Enterprise) 🏗️🚀

Este guia define o fluxo obrigatório para criar ou expandir o frontend do Ploc, garantindo que o projeto mantenha a modularidade (SoC) e a escalabilidade.

---

## 🛠️ O Fluxo de Construção (5 Passos)

### 1. Arquitetura SPA Shell (O Palco Central)
O Ploc utiliza uma arquitetura de página única. Isso significa:
- **HTML Único**: Apenas o `index.html` existe como entrada.
- **O Container**: Todas as "telas" são injetadas em um elemento mestre: `<div id="app"></div>`.
- **Componentização**: Telas (Login, Kanban, etc) são arquivos JS que exportam funções de renderização.

### 2. O Template Shell (index.html)
O arquivo mestre deve conter apenas o essencial e os scripts globais:
```html
<head>
    <!-- Configurações PWA e Viewport -->
    <link rel="stylesheet" href="css/theme.css">
    <link rel="stylesheet" href="css/app.css"> <!-- Estilos Globais -->
</head>
<body>
    <div id="app"></div> <!-- Onde a mágica acontece -->
    <script type="module" src="js/main.js"></script>
</body>
```

### 3. Estilização Moderna (Regras de Ouro)
- **Unidades Relativas**: Proibido usar `px`. Use `rem` para tudo (base 1rem = 16px).
- **Variáveis de Cor**: Use os tokens definidos em `theme.css`.
- **Separação**: Nunca use `<style>` dentro do HTML.

### 4. Lógica e Conectividade (JS)
- **Importação**: Sempre use `<script type="module" src="js/pagina.js"></script>`.
- **API**: Use o `apiClient` centralizado para qualquer comunicação:
  ```javascript
  import { apiClient } from './api/client.js';
  const data = await apiClient.get('/endpoint');
  ```

### 5. Registro no Service Worker (PWA)
Para que a nova página funcione offline:
1. Abra `src/frontend/sw.js`.
2. Adicione os novos caminhos (HTML, CSS e JS) na lista `ASSETS_TO_PRECACHE`.
3. Incremente a versão do `CACHE_NAME` (ex: `v11` -> `v12`).

---

## ✅ Checklist de Entrega
- [ ] O CSS está em um arquivo separado?
- [ ] O JavaScript está em um arquivo separado e é do tipo `module`?
- [ ] Usei `rem` em vez de `px`?
- [ ] A página foi adicionada ao `sw.js`?
- [ ] Não há `fetch` direto no código (usou o `apiClient`)?

---

## 💡 Lições de Batalha
- **[2026-05-08]**: A modularização total permitiu que o deploy do frontend fosse 40% mais rápido e livre de conflitos de CSS global.
