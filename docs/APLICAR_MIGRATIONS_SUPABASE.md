# Aplicar migrations no Supabase

O front usa o projeto Supabase:

`updhgbizgcmhvjzbdlnn`

Se o cadastro de equipamentos mostrar que a tabela nao existe, aplique a migration:

`supabase/migrations/20260605190000_add_operational_storage_tables.sql`

## Pelo painel do Supabase

1. Abra o projeto no Supabase.
2. Acesse **SQL Editor**.
3. Abra o arquivo `supabase/migrations/20260605190000_add_operational_storage_tables.sql`.
4. Copie todo o SQL.
5. Cole no SQL Editor.
6. Execute.

Essa migration cria:

- `equipamentos`
- `documentos`
- `etiquetas`
- `configuracoes`
- bucket privado `documentos`
- policies RLS para as novas tabelas e storage

Depois de executar, recarregue o app local e tente cadastrar o equipamento novamente.
