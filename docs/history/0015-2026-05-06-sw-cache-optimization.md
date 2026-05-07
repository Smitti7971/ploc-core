# 📅 Diário de Bordo: Ajuste de Segurança e Cache SW
**Data**: 2026-05-06
**Responsável**: Antigravity

## 🛠️ O que foi feito?
- **Otimização de Cache (sw.js v5)**: Removido `dashboard.html` do pré-cache para evitar erros 401 Unauthorized na tela de login.
- **Tratamento de API**: Configurado Service Worker para não interceptar chamadas `/api/`, garantindo que o token JWT do Backend seja tratado apenas pelo navegador.

## 🧠 Aprendizados e Decisões
- Arquivos protegidos não devem estar na lista de `install` do Service Worker, pois o SW tenta baixá-los sem os headers de autenticação do usuário, causando bloqueios no PWA.

## 📈 Próximos Passos
- Verificar se o erro 401 sumiu do console na tela de login.
