# DRAFT-003: Blindagem de Cache 2.0 (PWA & Nginx) 🛡️🚀

## Contexto
O App está sofrendo de "Cache Stickiness" (cache persistente), onde o navegador ignora atualizações do servidor devido a cabeçalhos de cache muito agressivos no Nginx e uma estratégia "Cache-First" no Service Worker.

## Objetivos
1.  **Atualização Imediata**: Garantir que novos deploys sejam detectados instantaneamente pelo navegador.
2.  **Estratégia Híbrida**: Usar "Network-First" para arquivos de lógica (JS/CSS) e manter o cache apenas para arquivos de mídia pesados.
3.  **Exclusão de Controle**: Impedir que o `sw.js` e o `manifest.json` sejam cacheados pelo Nginx.

## Lógica e Engrenagens
### 1. Nginx (Dockerfile)
A regra de cache será dividida:
- **Sem Cache (Controle)**: `index.html`, `sw.js`, `manifest.json`.
- **Cache Agressivo (Ativos)**: Imagens e fontes (.png, .jpg, .woff2).
- **Cache Moderado (Lógica)**: `.js` e `.css` (exceto sw.js).

### 2. Service Worker (sw.js)
- **Versão**: Bump para `ploc-v0.0.4`.
- **Estratégia**: Mudar de `Cache-First` para `Stale-While-Revalidate` ou `Network-First` para garantir que o navegador sempre tente buscar a versão mais nova em segundo plano.

## Riscos e Mitigação
- **Risco**: Aumento leve no consumo de banda.
- **Mitigação**: Otimização de Gzip no Nginx para compensar o tráfego.

## Aprovação Requerida
Aguardando o "OK" consciente do USER para criar o Plano Operacional e executar.
