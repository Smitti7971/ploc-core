# LEVANTAMENTO REAL DA INFRAESTRUTURA

Gerado exclusivamente via Coolify API.

- **Data do levantamento**: 2026-05-11
- **Hora do levantamento**: 16:08 (UTC)
- **Servidor consultado**: localhost (oqlvae72ncg31bbvjwbqq0qt)
- **IP do Servidor**: 72.61.63.84
- **Quantidade de serviços encontrados**: 4

---

## Serviço: assistente-ploc-frontend

### IDENTIFICAÇÃO
- **Nome real**: assistente-ploc-frontend
- **ID real**: 2
- **UUID**: a6n3eh22owgp057dd09t023a
- **Status**: running:unknown
- **Ambiente**: production
- **Tipo**: application
- **Destino**: coolify (jwayyxjibmevjz8whec2lj4p)
- **Projeto**: ploc
- **Servidor**: localhost
- **URL**: https://ploc.midializando.cloud
- **Domínio**: ploc.midializando.cloud
- **Porta**: 80
- **Rede**: coolify

### BUILD
- **Build Pack**: dockerfile
- **Dockerfile**: /Dockerfile
- **Branch**: main
- **Repositório**: Smitti7971/ploc-core
- **Commit**: HEAD
- **Auto Deploy**: não encontrado na Coolify API (campo explícito ausente no detalhe básico)
- **Watch Paths**: null
- **Base Directory**: /
- **Publish Directory**: /

### CONTAINER
- **Nome do container**: a6n3eh22owgp057dd09t023a (Gerado pelo Coolify)
- **Estado atual**: running:unknown
- **Healthcheck**: Enabled: false, Path: /, Interval: 5s, Retries: 10
- **Restart Policy**: não encontrado na Coolify API (campo explícito ausente no detalhe básico)
- **CPU**: 0 (Sem limite definido)
- **RAM**: 0 (Sem limite definido)
- **Limites**: Shares: 1024
- **Runtime**: não encontrado na Coolify API
- **Região**: não encontrado na Coolify API

### DEPLOY
- **Último deploy**: 2026-05-11T16:05:15.000000Z (updated_at)
- **Status do deploy**: success (inferido pelo status running)
- **Histórico**: disponível no Coolify (UUID a6n3eh22owgp057dd09t023a)
- **Logs disponíveis**: Sim
- **Tempo de build**: não encontrado na Coolify API
- **Tempo de uptime**: Last Online: 2026-05-11 16:05:15

### VARIÁVEIS
- **NIXPACKS_NODE_VERSION**: Escopo: Buildtime (is_buildtime: true) | Valor: 22
- **NEXT_PUBLIC_API_URL**: Escopo: Runtime/Buildtime (is_runtime: true) | Valor: http://y13oqeuehuz2mc5wr6plcu0x.72.61.63.84.sslip.io
- **REDEPLOY_TRIGGER**: Escopo: Runtime/Buildtime | Valor: force-rebuild-v2

### VOLUMES
- **Volumes**: nenhum encontrado na Coolify API para este serviço.

### REDE
- **Domínios**: ploc.midializando.cloud
- **Proxy**: Traefik
- **SSL**: Certresolver: letsencrypt (TLS: true)
- **Portas**: Exposta: 80
- **Exposição pública**: Sim (FQDN configurado)
- **Comunicação interna**: via rede 'coolify'

### OBSERVAÇÕES
- **NEXT_PUBLIC_API_URL**: Aponta para um domínio `sslip.io` em vez de `backend.midializando.cloud`.
- **Status**: Reportado como `running:unknown`.

---

## Serviço: ploc-backend-v3

### IDENTIFICAÇÃO
- **Nome real**: ploc-backend-v3
- **ID real**: 3
- **UUID**: leaocf7ke5lgluo0bg2dco0w
- **Status**: running:unknown
- **Ambiente**: production
- **Tipo**: application
- **Destino**: coolify (jwayyxjibmevjz8whec2lj4p)
- **Projeto**: ploc
- **Servidor**: localhost
- **URL**: https://backend.midializando.cloud
- **Domínio**: backend.midializando.cloud
- **Porta**: 3000
- **Rede**: coolify

### BUILD
- **Build Pack**: dockerfile
- **Dockerfile**: /Dockerfile
- **Branch**: main
- **Repositório**: Smitti7971/ploc-core.git
- **Commit**: HEAD
- **Auto Deploy**: não encontrado na Coolify API
- **Watch Paths**: null
- **Base Directory**: /apps/backend
- **Publish Directory**: /

### CONTAINER
- **Nome do container**: leaocf7ke5lgluo0bg2dco0w
- **Estado atual**: running:unknown
- **Healthcheck**: Enabled: false, Path: /, Interval: 5s, Retries: 10
- **Restart Policy**: não encontrado na Coolify API
- **CPU**: 0
- **RAM**: 0
- **Limites**: Shares: 1024
- **Runtime**: não encontrado na Coolify API
- **Região**: não encontrado na Coolify API

### DEPLOY
- **Último deploy**: 2026-05-11T16:06:16.000000Z (updated_at)
- **Status do deploy**: success (running)
- **Histórico**: disponível
- **Logs disponíveis**: Sim
- **Tempo de build**: não encontrado na Coolify API
- **Tempo de uptime**: Last Online: 2026-05-11 16:06:16

### VARIÁVEIS
- **NIXPACKS_NODE_VERSION**: Escopo: Buildtime | Valor: 22.12.0
- **DATABASE_URL**: Escopo: Runtime | Valor: [MASCARADO] (postgresql://postgres:***@rmybu33898amwear4xe4qsbc:5432/postgres?schema=public)
- **JWT_SECRET**: Escopo: Runtime/Buildtime | Valor: [MASCARADO] (ploc_segredo_2026)
- **OPENAI_API_KEY**: Escopo: Runtime | Valor: [MASCARADO] (sk-proj-***)

### VOLUMES
- **Volumes**: nenhum encontrado na Coolify API para este serviço.

### REDE
- **Domínios**: backend.midializando.cloud
- **Proxy**: Traefik
- **SSL**: Certresolver: letsencrypt (TLS: true)
- **Portas**: Exposta: 3000
- **Exposição pública**: Sim
- **Comunicação interna**: via rede 'coolify'

### OBSERVAÇÕES
- **Build Pack**: Embora use `dockerfile`, ainda possui variáveis prefixadas com `NIXPACKS_`.
- **Status**: Reportado como `running:unknown`.

---

## Serviço: postgresql

### IDENTIFICAÇÃO
- **Nome real**: postgresql
- **ID real**: 1
- **UUID**: rmybu33898amwear4xe4qsbc
- **Status**: running:healthy
- **Ambiente**: production
- **Tipo**: standalone-postgresql
- **Destino**: coolify (jwayyxjibmevjz8whec2lj4p)
- **Projeto**: ploc (inferido via destination/server)
- **Servidor**: localhost
- **URL**: postgres://postgres:***@72.61.63.84:5432/postgres
- **Domínio**: 72.61.63.84
- **Porta**: 5432
- **Rede**: coolify

### BUILD
- **Build Pack**: não aplicável (Standalone Database)
- **Dockerfile**: não aplicável
- **Image**: postgres:18-alpine

### CONTAINER
- **Nome do container**: postgresql
- **Estado atual**: running:healthy
- **Healthcheck**: não encontrado na Coolify API (standalone db)
- **Restart Policy**: não encontrado na Coolify API
- **CPU**: 0
- **RAM**: 0
- **Limites**: Shares: 1024

### DEPLOY
- **Último deploy**: 2026-05-11T16:06:16.000000Z (updated_at)
- **Status do deploy**: success (healthy)
- **Histórico**: disponível
- **Tempo de uptime**: Started At: 2026-05-05 21:48:31

### VARIÁVEIS
- **POSTGRES_USER**: postgres
- **POSTGRES_DB**: postgres
- **POSTGRES_PASSWORD**: [MASCARADO]

### VOLUMES
- **Volumes**: volumes persistentes gerenciados pelo Coolify (UUID rmybu33898amwear4xe4qsbc)

### REDE
- **Domínios**: 72.61.63.84 (Externo) / rmybu33898amwear4xe4qsbc (Interno)
- **SSL**: Mode: require
- **Portas**: 5432
- **Exposição pública**: Sim (is_public: true)
- **Comunicação interna**: via `rmybu33898amwear4xe4qsbc:5432`

### OBSERVAÇÕES
- **Versão**: Postgres 18-alpine em execução.

---

## Serviço: ploc-minio

### IDENTIFICAÇÃO
- **Nome real**: ploc-minio
- **ID real**: 1
- **UUID**: t7yxwgn1a636wmn1qeodul46
- **Status**: running:unknown
- **Ambiente**: production
- **Tipo**: service
- **Destino**: coolify (jwayyxjibmevjz8whec2lj4p)
- **Projeto**: ploc
- **Servidor**: localhost
- **URL**: http://72.61.63.84:9000 (API) / http://72.61.63.84:9001 (Console)
- **Domínio**: 72.61.63.84
- **Porta**: 9000, 9001
- **Rede**: coolify (t7yxwgn1a636wmn1qeodul46)

### BUILD
- **Build Pack**: docker-compose
- **Image**: minio/minio:latest

### CONTAINER
- **Nome do container**: ploc-minio / minio-t7yxwgn1a636wmn1qeodul46
- **Estado atual**: running:unknown
- **Restart Policy**: unless-stopped

### DEPLOY
- **Último deploy**: 2026-05-11T10:37:54.000000Z (updated_at)
- **Tempo de uptime**: Last Online: 2026-05-11 16:06:16

### VARIÁVEIS
- **MINIO_ROOT_USER**: ploc_admin
- **MINIO_ROOT_PASSWORD**: [MASCARADO] (ploc_secret_password_2026)
- **COOLIFY_RESOURCE_UUID**: t7yxwgn1a636wmn1qeodul46

### VOLUMES
- **t7yxwgn1a636wmn1qeodul46_ploc-minio-data**: Destino: /data

### REDE
- **Portas**: 9000, 9001
- **Exposição pública**: Sim (Portas mapeadas no host)
- **Comunicação interna**: via rede `t7yxwgn1a636wmn1qeodul46`

### OBSERVAÇÕES
- **Rede**: Possui uma rede dedicada `t7yxwgn1a636wmn1qeodul46` além da rede `coolify`.
