# Script de Deploy Automatizado - PLOC 🚀
param (
    [Parameter(Mandatory=$true)]
    [string]$msg
)

$TOKEN = "1|Gp7Pedhr4zp6OdxhmV90XTHrUvYRNd5tQ7m0yZy6fec2dfa3"
$FRONT_UUID = "a6n3eh22owgp057dd09t023a"
$BACK_UUID = "leaocf7ke5lgluo0bg2dco0w"

Write-Host "📦 Iniciando Sincronização Git..." -ForegroundColor Cyan
git add .
git commit -m "$msg"
git push origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "Git Push realizado com sucesso!" -ForegroundColor Green
    
    Write-Host "Disparando Deploy no Coolify (Frontend)..." -ForegroundColor Yellow
    curl.exe -k -s -X GET "https://coolify.midializando.cloud/api/v1/deploy?uuid=$FRONT_UUID`&force=true" -H "Authorization: Bearer $TOKEN"
    
    Write-Host "`nDisparando Deploy no Coolify (Backend)..." -ForegroundColor Yellow
    curl.exe -k -s -X GET "https://coolify.midializando.cloud/api/v1/deploy?uuid=$BACK_UUID`&force=true" -H "Authorization: Bearer $TOKEN"

    Write-Host "`nProcesso Finalizado! Aguarde alguns minutos para o build terminar no servidor." -ForegroundColor Green
} else {
    Write-Host "Erro no Git. O deploy foi cancelado." -ForegroundColor Red
}
