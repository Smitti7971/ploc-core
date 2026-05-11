const fs = require('fs');
const path = require('path');

const compose = `version: '3.8'
services:
  minio:
    image: 'minio/minio:latest'
    container_name: ploc-minio
    ports:
      - '9000:9000'
      - '9001:9001'
    environment:
      MINIO_ROOT_USER: ploc_admin
      MINIO_ROOT_PASSWORD: ploc_secret_password_2026
    volumes:
      - 'ploc_minio_data:/data'
    command: 'server /data --console-address ":9001"'
volumes:
  ploc_minio_data:`;

const base64 = Buffer.from(compose).toString('base64');

const json = {
    name: 'ploc-minio',
    project_uuid: 'usabqksth1d7cjwidra64s6t',
    environment_name: 'production',
    server_uuid: 'oqlvae72ncg31bbvjwbqq0qt',
    destination_uuid: 'jwayyxjibmevjz8whec2lj4p',
    docker_compose_raw: base64
};

fs.writeFileSync(path.join(__dirname, 'apps', 'backend', 'minio-service.json'), JSON.stringify(json, null, 2));
console.log('✅ JSON de serviço criado com Base64!');
