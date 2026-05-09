# GUIA MESTRE: Desenvolvimento Híbrido (ON/OFF) 🏠☁️

Este guia define como trabalhar no Ploc de forma offline e sincronizar mudanças com a produção de forma automática.

## 🏠 1. Modo Offline (Desenvolvimento Local)

Para criar novas lógicas e testar sem depender da internet:

1.  **Subir o Banco Local**:
    ```powershell
    docker-compose up -d
    ```
2.  **Configurar o `.env` (Raiz e Backend)**:
    Garanta que a sua `DATABASE_URL` local seja:
    `postgresql://devuser:devpassword@localhost:5432/ploc_dev?schema=public`
3.  **Aplicar Mudanças de Schema**:
    Se alterar o `schema.prisma`, rode no backend:
    ```powershell
    npx prisma migrate dev --name nome_da_mudanca
    ```
    *Isso criará a tabela no seu PC e gerará o arquivo de sincronia para a nuvem.*

## ☁️ 2. Modo Online (Produção)

Para enviar suas criações para o mundo:

1.  **Git Push**:
    ```powershell
    git add .
    git commit -m "feat: minha nova funcionalidade"
    git push
    ```
2.  **Sincronia Automática**:
    O deploy no Coolify lerá a pasta `prisma/migrations` e aplicará as mesmas mudanças no banco da nuvem. **Você não precisa fazer nada manual no servidor.**

## 🛡️ Regras de Ouro
- **NUNCA** mude o `provider = "postgresql"` no schema.prisma.
- **NUNCA** remova o `.env` do `.gitignore`.
- O banco local (`ploc-db-local`) é persistente. Se você desligar o PC, os dados continuam lá.
