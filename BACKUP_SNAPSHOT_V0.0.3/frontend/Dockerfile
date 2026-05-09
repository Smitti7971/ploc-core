FROM nginx:stable-alpine

# Copia os arquivos do frontend para o diretório padrão do Nginx
COPY . /usr/share/nginx/html

# Configuração customizada para suportar SPA (Single Page Application)
# Garante que arquivos estáticos sejam servidos e rotas desconhecidas caiam no index.html
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
