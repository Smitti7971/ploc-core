# Dockerfile: Backend PLOC (Enterprise Edition) 🐳
FROM node:22-slim

# 1. Instalar dependências de sistema essenciais para o Prisma ORM
RUN apt-get update && apt-get install -y \
    openssl \
    libssl-dev \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# 2. Definir diretório de trabalho
WORKDIR /app

# 3. Copiar manifestos de dependências e esquema do banco
COPY package*.json ./
COPY prisma ./prisma/

# 4. Instalar dependências e gerar o cliente Prisma (Build-time)
# Usando flags para economizar memória (OOM) no servidor
RUN npm install --no-audit --no-fund --legacy-peer-deps
RUN npx prisma generate

# 5. Copiar o restante do código fonte
COPY . .

# 6. Expor a porta da API
EXPOSE 3000

# 7. Comando de inicialização: 
# Gera o cliente (garantia), roda migrações e inicia o servidor.
CMD ["npm", "start"]
