# GUIA: Uso do PowerShell (Windows) 🐚

## Quando usar
- Sempre que houver execução de comandos no terminal local.
- Para automações, chamadas de API e manipulação de arquivos no Windows.

## Checklist obrigatório
- [ ] Verificar se o comando existe no PowerShell (ex: `Get-Command [nome]`).
- [ ] Usar aspas duplas `"` para strings e aspas duplas escapadas `\"` dentro de JSONs.
- [ ] Preferir comandos nativos (cmdlets) em vez de aliases do Linux.

## Execução padrão (Boas Práticas)

### 📡 Chamadas de API
Em vez de `curl`, use o `Invoke-RestMethod` (IRM):
```powershell
$headers = @{ "Authorization" = "Bearer TOKEN" }
$body = @{ base_directory = "/src/frontend" } | ConvertTo-Json
Invoke-RestMethod -Uri "http://IP:8000/api/v1/..." -Method Patch -Headers $headers -Body $body -ContentType "application/json"
```

### 📂 Manipulação de Arquivos
- Mover: `Move-Item -Path "origem" -Destination "destino"`
- Remover: `Remove-Item -Path "caminho" -Recurse -Force`
- Listar: `Get-ChildItem`

## Erros comuns
- **Alias de curl**: Digitar `curl` e esperar que ele se comporte como o curl do Linux. O PowerShell usa o `Invoke-WebRequest` por padrão para esse alias.
- **Aspas simples**: O PowerShell trata aspas simples `'` de forma literal, o que pode quebrar payloads JSON. Use sempre `"` e escape com `\` ou `` ` ``.

## Estratégias de fallback
- Se um cmdlet falhar, tente usar o executável direto com a extensão (ex: `git.exe`, `curl.exe`).
