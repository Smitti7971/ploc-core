param (
    [Parameter(Mandatory=$true)]
    [string]$msg
)

# Garantir que estamos na raiz
Write-Host "--- INICIANDO BACKUP NO GIT ---" -ForegroundColor Cyan

Write-Host "1. Adicionando arquivos..."
git add .

Write-Host "2. Criando commit com a mensagem: $msg"
git commit -m "$msg"

Write-Host "3. Enviando para o servidor (Push)..."
git push origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "--- BACKUP CONCLUIDO COM SUCESSO ---" -ForegroundColor Green
} else {
    Write-Host "--- ERRO NO GIT: O BACKUP FALHOU ---" -ForegroundColor Red
}
