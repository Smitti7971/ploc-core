# Dockerfile Raiz (Proxy para Frontend SPA) 🍮🚀
# Este arquivo existe para satisfazer a configuração do Coolify que busca o Dockerfile na raiz.

FROM nginx:stable-alpine

# 1. Copia os arquivos do frontend a partir do diretório monorepo
COPY apps/frontend /usr/share/nginx/html

# 2. Configuração customizada para suportar SPA (Single Page Application)
RUN echo 'server { \
    listen 80; \
    server_name localhost; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
    location ~* \.(js|css|json|png|jpg|jpeg|gif|ico|svg)$ { \
        expires max; \
        log_not_found off; \
        access_log off; \
        add_header Cache-Control "public, no-transform"; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
