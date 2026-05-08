FROM nginx:stable-alpine

# Copia os arquivos da RAIZ para o diretório do Nginx
COPY index.html /usr/share/nginx/html/
COPY js /usr/share/nginx/html/js
COPY css /usr/share/nginx/html/css

# Configuração para SPA
RUN echo 'server { \
    listen 80; \
    server_name localhost; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
    location ~* \.(js|css|json|png|jpg|jpeg|gif|ico|svg)$ { \
        try_files $uri =404; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
