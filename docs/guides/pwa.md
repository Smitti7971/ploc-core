# 📱 Guia de Progressive Web App (PWA) - PLOC

Este guia documenta as configurações necessárias para manter a experiência de "App Nativo" do PLOC, incluindo requisitos técnicos do Chrome para o "Rich Install UI".

## 🛠️ Estrutura de Arquivos
- `src/frontend/manifest.json`: Configurações de identidade e visual do app.
- `src/frontend/sw.js`: Service Worker para cache offline e atualizações.
- `src/frontend/assets/`: Contém os ícones e screenshots.

## 🖼️ Requisitos de Ativos

### Ícones
- **Arquivo**: `assets/icon-192.png`
- **Tamanho**: Exatamente 192x192px.
- **Uso**: Ícone da tela inicial e favicon.

### Screenshots (Rich Install UI)
Para que o Chrome mostre a interface de instalação "Rica" (com fotos), as screenshots devem ter as dimensões EXATAS capturadas do navegador:

| Form Factor | Arquivo | Dimensões Exatas |
| :--- | :--- | :--- |
| **Mobile (narrow)** | `assets/screenshot-mobile.png` | **625x938px** |
| **Desktop (wide)** | `assets/screenshot-desktop.png` | **1584x883px** |

> [!IMPORTANT]
> Se as dimensões no `manifest.json` não baterem com os pixels reais do arquivo, o Chrome exibirá um erro de validação e não mostrará a interface rica.

## 🔄 Fluxo de Atualização
Sempre que houver mudanças no PWA (ícones ou manifest):
1.  Atualize o `version` no `manifest.json`.
2.  Atualize o `CACHE_NAME` no `sw.js` (ex: `v4` -> `v5`) para forçar o navegador a limpar o cache antigo.
3.  **Deploy Duplo**: Realize o deploy tanto do Frontend quanto do Backend via API do Coolify para garantir sincronia.

## 🧪 Como Validar
1. Abra o Chrome DevTools (F12).
2. Vá na aba **Application** -> **Manifest**.
3. Verifique se há erros na seção "Installability".
4. Use o botão "Sync" ou "Update on reload" para testar o Service Worker.
