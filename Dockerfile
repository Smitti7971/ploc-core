FROM nginx:stable-alpine

# Copia os arquivos da pasta frontend para o diretório do Nginx
COPY src/frontend /usr/share/nginx/html

# Configuração para SPA e tipos de arquivos corretos
RUN echo 'server { \
    listen 80; \
    server_name localhost; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
    location ~* \.(js|css|json|png|jpg|jpeg|gif|ico|svg)$ { \
        add_header Content-Type $content_type; \
        try_files $uri =404; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
