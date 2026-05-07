# Tarefa Atual: Refatoração Modular do Frontend (Fase 1) 🎨🏗️

## 1. Entender (Intenção) 🧠
- **O quê**: Organizar o frontend em pastas e módulos ES6.
- **Por quê**: Separar lógica de visual e facilitar a manutenção enterprise.
- **Metáfora**: Criar as gavetas e cabides do nosso Guarda-Roupa Modular.

## 2. Preparar (Logística) 🎒
- **Arquivos-Alvo**: Todos os arquivos em `src/frontend/`.
- **Ambiente**: Navegador (para testes de módulo).
- **Risco**: Erros de "MIME type" ou caminhos de arquivo incorretos ao usar `type="module"`.
- **Proteção**: Fazer um backup mental dos scripts atuais antes de migrar.

## 3. O Que Executar (Ação) 🛠️
Esta seção será atualizada passo a passo com o **Heartbeat**.

- [x] **Passo 1**: Mapear o terreno e criar a estrutura de diretórios (`css/`, `js/api/`, etc).
- [x] **Passo 2**: Criar o Mensageiro Central (`js/api/client.js`) para todas as chamadas de API.
- [x] **Passo 3**: Criar a Base Visual (`css/theme.css`) e o Layout Base.
- [x] **Passo 4**: Migrar a lógica de Login para o novo padrão e testar a fiação.

## 4. Resultado Esperado (Visão) 👁️
- Uma estrutura de pastas limpa e profissional.
- O Login funcionando através de um módulo Javascript (`import/export`).
- Console do navegador limpo, sem erros de carregamento.

## 5. Validar & Testar (Prova de Vida) ✅
- **Teste 1**: Verificar se as pastas foram criadas corretamente.
- **Teste 2**: Tentar realizar um login e ver se o token é salvo no `localStorage`.
- **Teste 3**: Validar se o CSS modular está sendo carregado pelo HTML.

---
## 🔄 Tentativas e Logs (Heartbeat)
### Passo 1: Mapear e Criar Estrutura
- Tentativa 1 - ✅ [Sucesso]: Pastas criadas após auditoria de terreno. Estrutura pronta para receber os módulos.
