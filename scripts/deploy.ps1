# Script de Deploy Automatizado - PLOC
param (
    [Parameter(Mandatory=$true)]
    [string]$msg
)

$TOKEN = "1|Gp7Pedhr4zp6OdxhmV90XTHrUvYRNd5tQ7m0yZy6fec2dfa3"
$FRONT_UUID = "a6n3eh22owgp057dd09t023a"
$BACK_UUID = "leaocf7ke5lgluo0bg2dco0w"

Write-Host "Iniciando Sincronizacao Git..." -ForegroundColor Cyan
git add .
git commit -m $msg
git push origin main

Write-Host "Disparando Deploy no Coolify (Frontend)..." -ForegroundColor Yellow
$frontUrl = "https://coolify.midializando.cloud/api/v1/deploy?uuid=$($FRONT_UUID)&force=true"
curl.exe -k -s -X GET $frontUrl -H "Authorization: Bearer $TOKEN"

Write-Host "Disparando Deploy no Coolify (Backend)..." -ForegroundColor Yellow
$backUrl = "https://coolify.midializando.cloud/api/v1/deploy?uuid=$($BACK_UUID)&force=true"
curl.exe -k -s -X GET $backUrl -H "Authorization: Bearer $TOKEN"

Write-Host "Processo Finalizado! Verifique o painel do Coolify." -ForegroundColor Green
