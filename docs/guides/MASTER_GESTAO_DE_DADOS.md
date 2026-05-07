# GUIA MESTRE: Gestão de Dados (O Arquivo Central) 📊🗄️

## A Lógica da Biblioteca
O Banco de Dados (PostgreSQL) do Ploc não é um "buraco negro". Pense nele como uma biblioteca ultra organizada:

1.  **As Estantes (Tabelas)**: Temos a estante dos "Usuários", a das "Tarefas" e a das "Rotinas".
2.  **As Fichas (Registros)**: Cada tarefa que você cria é uma ficha dentro da estante. Ela tem um número único (ID) para nunca ser confundida com outra.
3.  **O Bibliotecário (Prisma)**: É o software que eu (Agente) uso para falar com o banco. Eu não preciso "invadir" a biblioteca; eu peço ao Prisma: *"Por favor, pegue a ficha de tarefa nº 20"*.

---

## 🏗️ Como os dados se relacionam?

Os dados no Ploc não estão soltos, eles estão "amarrados":
- **Usuário -> Tarefa**: Toda tarefa tem um "Dono". Se o usuário for deletado, as tarefas dele também sumirão (para não deixar lixo na biblioteca).
- **Tarefa -> Rotina**: Algumas tarefas pertencem a um "Grupo" (Rotina).

---

## ⚠️ Como protegemos os Dados? (Integridade)

Para que a nossa biblioteca nunca pegue fogo:
1.  **Backups**: O Coolify cuida de tirar fotos (Snapshots) do banco periodicamente.
2.  **Migrações (Migrations)**: Se quisermos colocar uma prateleira nova (ex: uma coluna de "Prioridade"), não fazemos isso "na marra". Usamos um script de Migração para que a biblioteca seja atualizada de forma segura sem rasgar as fichas antigas.
3.  **Tipagem**: Se uma prateleira foi feita para guardar "Números", o sistema não deixa você tentar guardar "Texto" lá. Isso evita erros de lógica.

---

## Checklist para o Arquiteto (Smitti)
- [ ] O modelo de dados (Knowledge) reflete o que você imaginou para o negócio?
- [ ] Os dados estão sendo salvos corretamente após cada ação no site?

---

## 💡 Lições de Batalha (Evolução Contínua)
*Espaço reservado para anotar práticas eficazes e erros evitados durante as execuções.*

- **[2026-05-07]**: O uso de metáforas (Estantes/Fichas) ajuda o Arquiteto a validar a lógica do banco antes de mexer no Prisma.
