# Estratégia: Migração para Arquitetura SPA 🚀

## 🎯 Objetivo
Transformar o Ploc de um site de múltiplas páginas em uma **Single Page Application (SPA)** robusta, melhorando a performance e a experiência do usuário.

## 🛠️ Engrenagens da Migração
1. **Palco Central**: Reduzir `index.html` ao mínimo necessário (Shell).
2. **Sistema de Rotas**: Implementar um roteador simples no `main.js` que monitora o `localStorage` (para decidir se mostra Login ou Dashboard).
3. **Componentização de Telas**:
   - `js/components/Landing.js`
   - `js/components/Login.js`
   - `js/components/Register.js`
   - `js/components/Dashboard.js`
4. **Persistência de Estilo**: Manter os arquivos `.css` externos e carregá-los conforme a necessidade ou globalmente.

## ⚠️ Riscos e Mitigações
- **Perda de Funções**: Garantir que todos os `eventListeners` sejam re-anexados após a injeção do DOM.
- **Histórico do Navegador**: Usar `history.pushState` se necessário para permitir o uso do botão "Voltar".

## ✅ Próximos Passos:
1. Criar a estrutura de pastas em `js/components/`.
2. Preparar o `main.js` como roteador inicial.
3. Migrar a Landing Page para o formato de componente.
