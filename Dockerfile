FROM nginx:stable-alpine

# Copia TODOS os arquivos da pasta frontend para o servidor
COPY src/frontend /usr/share/nginx/html

# Configuração robusta para SPA
RUN echo 'server { \
    listen 80; \
    server_name localhost; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        add_header Cache-Control "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0"; \
        try_files $uri $uri/ /index.html; \
    } \
    location ~* \.(js|css|json|png|jpg|jpeg|gif|ico|svg)$ { \
        add_header Cache-Control "public, max-age=31536000"; \
        try_files $uri =404; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
