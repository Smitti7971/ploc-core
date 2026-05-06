# GUIA: Ferramentas de Desenvolvimento (Windows) 🛠️

## Quando usar
- Instalação de utilitários de CLI (jq, git, docker, etc).
- Configuração de ambiente local.

## Checklist obrigatório
- [ ] Verificar se o gerenciador de pacotes (`winget` ou `choco`) está disponível.
- [ ] Rodar o terminal como Administrador (se necessário).

## Execução padrão (Via Winget)
1. Abrir PowerShell.
2. Procurar pacote: `winget search [nome]`.
3. Instalar: `winget install [ID-do-pacote]`.
4. Validar: `[comando] --version`.

## Ferramentas Instaladas (Inventário)
- **Winget**: v1.28.240 (Gerenciador de pacotes).
- **jq**: v1.8.1 (Processador JSON). Instalado em 2026-05-06.
- **curl**: Nativo do Windows (Utilizado para chamadas de API).

## Erros comuns
- Problemas de permissão de execução no PowerShell.
- **PATH não atualizado**: Após instalar via Winget, é obrigatório reiniciar o terminal/VS Code para que o comando seja reconhecido.
