FROM nginx:stable-alpine

# Copia TODOS os arquivos necessários da raiz
COPY ploc.html /usr/share/nginx/html/index.html
COPY manifest.json /usr/share/nginx/html/
COPY sw.js /usr/share/nginx/html/
COPY *.png /usr/share/nginx/html/
COPY js /usr/share/nginx/html/js
COPY css /usr/share/nginx/html/css

# Configuração para SPA (agora com suporte total a rotas e cache busting)
RUN echo 'server { \
    listen 80; \
    server_name localhost; \
    root /usr/share/nginx/html; \
    index index.html; \
    # Adiciona headers de segurança e desabilita cache agressivo para o index \
    location / { \
        add_header Cache-Control "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0"; \
        try_files $uri $uri/ /index.html; \
    } \
    location /app { \
        alias /usr/share/nginx/html/; \
        index index.html; \
        try_files $uri $uri/ /index.html; \
    } \
    location ~* \.(js|css|json|png|jpg|jpeg|gif|ico|svg)$ { \
        add_header Cache-Control "public, max-age=31536000"; \
        try_files $uri =404; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
