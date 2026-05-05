# Plano de Teste: Validação de Conexões de API

> **Para o Agente:** Siga este plano de forma exata e peça permissão para cada comando.

**Objetivo:** Garantir que os tokens fornecidos estão funcionando para automação do Ploc.

---

### Tarefa 1: Validar Conexão com GitHub

    - **Passo 1: Verificar Token no Perfil do Usuário**
      > Executar: `curl.exe -s -H "Authorization: token <GITHUB_TOKEN>" https://api.github.com/user`

### Tarefa 2: Validar Conexão com Coolify

    - **Passo 1: Listar Projetos no Servidor**
      > Executar: `curl.exe -s -H "Authorization: Bearer 1|Gp7Pedhr4zp6OdxhmV90XTHrUvYRNd5tQ7m0yZy6fec2dfa3" http://72.61.63.84:8000/api/v1/projects`
