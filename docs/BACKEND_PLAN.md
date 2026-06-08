# MundoRastro - Plano de Backend

## Estado atual do front end

O projeto e um front end Vite + React + TypeScript com shadcn/ui, Tailwind CSS, React Router e TanStack Query.

O backend planejado no codigo atual e Supabase:

- autenticacao por email/senha em `src/pages/Login.tsx`;
- cadastro de usuario com `full_name` em metadata;
- cliente Supabase em `src/integrations/supabase/client.ts`;
- tipos gerados em `src/integrations/supabase/types.ts`;
- migracoes SQL em `supabase/migrations`.

Inicialmente, somente autenticacao estava conectada ao Supabase. Nesta etapa, os modulos principais passaram a listar, criar ou derivar dados reais do Supabase: `propriedades`, `talhoes`, `safras`, `equipamentos`, `caderno_campo`, `producao`, `lotes_rastreabilidade`, `estoque`, `compras`, `financeiro`, `expedicao`, `etiquetas`, `documentos`, `usuarios`, `configuracoes`, `dashboard` e `relatorios`. A consulta de QR code tambem passou a buscar lotes reais por codigo.

## Rotas e modulos existentes

- `/login`: entrada, cadastro e Google OAuth via Lovable.
- `/dashboard`: indicadores gerais, alertas, atividades recentes e atalhos.
- `/propriedades`: propriedades rurais.
- `/talhoes`: talhoes/areas de cultivo.
- `/equipamentos`: maquinas e equipamentos.
- `/caderno-de-campo`: atividades agronomicas.
- `/safras`: ciclos de cultivo.
- `/producao`: registros de producao/colheita.
- `/rastreabilidade`: lotes rastreaveis.
- `/consulta-qrcode`: consulta publica de lote por codigo.
- `/expedicao`: envio/saida de lotes.
- `/etiquetas`: etiquetas/QR codes.
- `/estoque`: itens de estoque e controle de minimo.
- `/compras`: pedidos e compras.
- `/financeiro`: transacoes financeiras.
- `/relatorios`: relatorios.
- `/usuarios`: usuarios e papeis.
- `/documentos`: documentos.
- `/configuracoes`: configuracoes do sistema.

## Esquema Supabase existente

As migracoes ja criam:

- `profiles`
- `user_roles`
- `propriedades`
- `talhoes`
- `safras`
- `caderno_campo`
- `producao`
- `compras`
- `estoque`
- `movimentacoes_estoque`
- `lotes_rastreabilidade`
- `expedicao`
- `financeiro`

Tambem existe:

- enum `app_role`: `admin`, `manager`, `operator`;
- trigger para criar perfil e papel `operator` no cadastro;
- RLS por `user_id`, com excecao para `admin`;
- consulta publica para `lotes_rastreabilidade`, usada por QR code.

## Gaps principais

1. Proteger logout com `supabase.auth.signOut()`.
   Status: implementado no `Sidebar`.

2. Conectar telas aos dados reais.
   Status: paginas principais conectadas ao Supabase ou a dados derivados reais. `relatorios` exporta CSV das tabelas atuais e `dashboard` calcula indicadores agregados.

3. Criar formularios reais de criacao/edicao.
   Muitos botoes "Novo" existem visualmente, mas ainda nao abrem fluxo persistente.

4. Definir estrategia para entidades que ainda nao tem tabela.
   `equipamentos`, `documentos`, `etiquetas` e `configuracoes` agora tem migracao inicial em `supabase/migrations/20260605190000_add_operational_storage_tables.sql`. `relatorios` seguem como derivacao de dados existentes.

5. Consolidar dashboard.
   Status: indicadores, alertas, safras e atividades recentes sao calculados a partir das tabelas reais. Futuramente, agregacoes repetidas podem virar views/RPCs no Supabase.

6. Configurar ambiente.
   O projeto espera `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY`.

## Ordem recomendada de implementacao

1. Base de autenticacao
   - corrigir logout; Status: implementado.
   - validar redirecionamento de rotas protegidas;
   - confirmar politicas RLS com usuario comum e admin.

2. Cadastros essenciais
   - propriedades; Status: listagem e criacao implementadas.
   - talhoes; Status: listagem e criacao implementadas.
   - safras; Status: listagem e criacao implementadas.
   - equipamentos; Status: listagem e criacao implementadas.

3. Operacao agricola
   - caderno de campo; Status: listagem e criacao implementadas.
   - producao; Status: listagem e criacao implementadas.
   - lotes de rastreabilidade; Status: listagem e criacao implementadas.
   - consulta publica por QR code; Status: busca publica por codigo implementada.

4. Gestao operacional
   - estoque; Status: listagem e criacao implementadas.
   - movimentacoes de estoque;
   - compras; Status: listagem e criacao implementadas.
   - expedicao; Status: listagem e criacao implementadas.
   - etiquetas; Status: listagem e criacao implementadas.

5. Gestao administrativa
   - financeiro; Status: listagem e criacao implementadas.
   - usuarios/papeis; Status: listagem real de `profiles` e `user_roles`.
   - documentos; Status: listagem, cadastro e upload para Storage implementados.
   - configuracoes; Status: leitura e salvamento por chave implementados.
   - relatorios; Status: exportacao CSV a partir das tabelas reais implementada.

6. Dashboard
   - Status: indicadores mockados substituidos por contagens, somas, alertas e ultimas atividades reais.

## Padrao de integracao sugerido no front

Criar uma camada pequena por dominio em `src/services` ou `src/features`, por exemplo:

- `src/services/propriedades.ts`
- `src/services/talhoes.ts`
- `src/services/estoque.ts`
- `src/services/rastreabilidade.ts`

Cada service deve expor funcoes simples:

- `list...`
- `create...`
- `update...`
- `delete...`

As paginas podem consumir essas funcoes com TanStack Query:

- `useQuery` para listas e detalhes;
- `useMutation` para criar, atualizar e excluir;
- invalidacao de queries apos mutations.

## Fluxo GitHub

O repositório foi clonado de:

`https://github.com/devgaps/mundorastro.git`

Para manter front e back unificados:

- cada etapa deve ser commitada no mesmo repo;
- migracoes Supabase entram em `supabase/migrations`;
- alteracoes de front entram em `src`;
- documentacao entra em `docs`;
- push exige credenciais GitHub com permissao de escrita.

No ambiente atual, clone publico funciona. Para push, ainda sera preciso autenticar GitHub.
