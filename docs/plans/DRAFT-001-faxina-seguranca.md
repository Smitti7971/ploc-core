# DRAFT-001: Faxina de Segurança e Centralização (PLOC) 🧹🔒

## Contexto
O projeto PLOC possui arquivos duplicados na raiz e em `src/frontend/`. Para garantir a integridade do deploy e evitar confusão ("arquivos fantasmas"), é necessário centralizar toda a lógica do frontend em `src/frontend/` e remover os resquícios da raiz.

## Objetivos
1.  **Limpeza**: Remover arquivos e diretórios legados/fantasmas da raiz do projeto.
2.  **Padronização**: Configurar o ambiente frontend para operar exclusivamente em modo ONLINE, apontando para o backend de produção.
3.  **Identidade**: Garantir que o título da aplicação esteja correto em `src/frontend/index.html`.

## Lógica e Engrenagens
### 1. Remoção de Arquivos (Raiz)
Os seguintes itens serão deletados da raiz (`/`):
-   `index.html`
-   `sw.js`
-   `manifest.json`
-   `icon-192.png`
-   `icon-512.png`
-   `js/` (Diretório)
-   `css/` (Diretório)

*Nota: Já validamos que estes itens existem em `src/frontend/`.*

### 2. Configuração de Ambiente
O arquivo `src/frontend/js/config.js` será atualizado para:
```javascript
export const CONFIG = {
    API_BASE_URL: 'https://backend.midializando.cloud/api',
    VERSION: 'v0.0.3'
};
```
Isso fixa a aplicação no modo ONLINE.

### 3. Título da Aplicação
Em `src/frontend/index.html`, o `<title>` será alterado para `PLOC - O Seu Sócio`.

## Riscos e Mitigação
-   **Risco**: O deploy falhar se o Nginx estiver apontando para a raiz em vez de `src/frontend/`.
-   **Mitigação**: O `MAPA_DO_PROJETO.md` indica que o `Base Directory` do frontend no Coolify é `/`, mas o `Dockerfile` (que é o Build Pack) provavelmente lida com a cópia dos arquivos. Precisamos garantir que o `Dockerfile` na raiz aponte para `src/frontend/`.

## Aprovação Requerida
Aguardando o "OK" consciente do USER para proceder com a criação do plano operacional e execução.
