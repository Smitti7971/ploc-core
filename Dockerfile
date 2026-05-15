# Estágio 1: Build do Frontend (Next.js) 🚀
FROM node:20-alpine AS builder

WORKDIR /app

# 1. Instala dependências do Monorepo (Raiz)
COPY package.json package-lock.json ./
RUN npm install

# 2. Prepara e instala dependências do Apps/Web
COPY apps/web/package.json apps/web/package-lock.json ./apps/web/
WORKDIR /app/apps/web
RUN npm install

# 3. Copia o código fonte e executa o build
WORKDIR /app
COPY apps/web ./apps/web
WORKDIR /app/apps/web
# O build gera a pasta /app/apps/web/out (devido ao output: 'export' no next.config.ts)
RUN npm run build

# Estágio 2: Servidor de Produção (Nginx) 🍮
FROM nginx:stable-alpine

# Copia os arquivos estáticos gerados no estágio anterior
COPY --from=builder /app/apps/web/out /usr/share/nginx/html

# Configuração para Single Page Application (SPA) e roteamento Next.js
RUN echo 'server { \
    listen 80; \
    server_name localhost; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
    # Cache para assets estáticos \
    location ~* \.(js|css|json|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ { \
        expires max; \
        log_not_found off; \
        access_log off; \
        add_header Cache-Control "public, no-transform"; \
    } \
    error_page 404 /index.html; \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
