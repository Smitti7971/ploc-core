# GUIA: Refatoração Arquitetural Enterprise 🏢🚀

## Quando usar
- Ao migrar de um monolito simples para uma arquitetura modular.
- Quando o arquivo `index.js` começar a crescer demais.
- Para garantir que a lógica de negócio esteja separada da lógica de roteamento.

## Checklist de Segurança (NÃO QUEBRAR O CÓDIGO)
- [ ] Mantenha o servidor rodando e teste o endpoint `/api/health` após cada mudança.
- [ ] Nunca remova uma funcionalidade do `index.js` antes de validar que o novo módulo está funcionando.
- [ ] Use `git commit` atômicos para cada arquivo movido.

## A Estrutura de Camadas (The Enterprise Way)

### 1. Config (`/config`)
- **O que guarda**: Regras globais, segurança (CORS, Rate Limit), Conexão com Banco.
- **Regra**: Não deve conter lógica de negócio, apenas definições.

### 2. Routes (`/src/backend/routes`)
- **O que guarda**: Definição dos caminhos (URLs) e métodos (GET, POST).
- **Regra**: Deve ser "limpa". Ela apenas recebe a requisição e passa para o **Controller**.

### 3. Controllers (`/src/backend/controllers`)
- **O que guarda**: O "Cérebro" da funcionalidade. Valida os dados da requisição.
- **Regra**: Chama o **Service** para lidar com os dados e retorna a resposta para o cliente.

### 4. Services (`/src/backend/services`)
- **O que guarda**: A comunicação com o Banco de Dados (Prisma).
- **Regra**: É aqui que o Prisma vive. Controllers não devem falar com o Prisma diretamente.

### 5. Middleware (`/src/backend/middleware`)
- **O que guarda**: Filtros de segurança (Auth JWT), Logs, Tratamento de Erros.

## Execução Padrão de Refatoração

1. **Extração de Config**: Mova as configurações de segurança para `config/`.
2. **Criação do Controller**: Mova a lógica da rota para uma função no Controller.
3. **Criação do Service**: Mova o comando `prisma.task.create` (exemplo) para o Service.
4. **Vínculo**: Rota -> Controller -> Service.

## Erros Comuns
- **Circular Dependencies**: Um arquivo importa o outro que importa o primeiro. (Dica: Mantenha a hierarquia sempre de cima para baixo).
- **Perda de Middleware**: Esquecer de passar o `authMiddleware` na nova rota.

## Estratégias de Fallback
- Se a API parar de responder, reverta o último commit e valide se o `require()` está apontando para o caminho correto.
