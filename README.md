# MundoRastro

> Sistema de gestão rural para organizar a operação agrícola, da propriedade à expedição, com rastreabilidade de lotes por QR Code.

O **MundoRastro** centraliza informações operacionais, produtivas e administrativas de propriedades rurais. A aplicação conta com autenticação, controle de acesso, dados persistidos no Supabase e uma consulta pública de rastreabilidade para os lotes cadastrados.

## Principais recursos

- Gestão de propriedades, talhões, safras e equipamentos;
- Registro de atividades no caderno de campo e de produção/colheita;
- Rastreabilidade de lotes com geração de etiquetas e QR Code;
- Consulta pública de lotes por código;
- Controle de estoque, compras, expedições e movimentações financeiras;
- Gestão de documentos, usuários, permissões e configurações;
- Dashboard com indicadores, alertas e atividades recentes;
- Exportação de relatórios em CSV;
- Tema claro/escuro.

## Tecnologias

| Camada | Tecnologias |
| --- | --- |
| Front-end | React 18, TypeScript, Vite |
| Interface | Tailwind CSS, shadcn/ui, Radix UI, Lucide |
| Dados e estado | Supabase, TanStack Query |
| Formulários | React Hook Form, Zod |
| Gráficos e QR Code | Recharts, qrcode |
| Qualidade | ESLint |

## Módulos do sistema

| Módulo | Finalidade |
| --- | --- |
| Dashboard | Acompanha indicadores, alertas, safras e atividades recentes. |
| Propriedades e talhões | Mantém o cadastro das unidades rurais e das áreas de cultivo. |
| Safras | Organiza ciclos de cultivo. |
| Equipamentos | Registra máquinas, status e manutenções. |
| Caderno de campo | Registra atividades agronômicas. |
| Produção | Controla registros de colheita e produção. |
| Rastreabilidade | Cria e acompanha lotes rastreáveis. |
| Consulta QR Code | Permite consultar publicamente um lote pelo seu código. |
| Estoque e compras | Controla itens, níveis mínimos e pedidos de compra. |
| Expedição | Registra a saída e o envio de lotes. |
| Etiquetas | Gera etiquetas associadas a lotes. |
| Financeiro | Organiza transações financeiras. |
| Documentos | Armazena documentos vinculados à operação e às propriedades. |
| Usuários | Exibe usuários e seus papéis de acesso. |
| Configurações | Salva preferências por usuário. |
| Relatórios | Exporta dados operacionais em CSV. |

## Pré-requisitos

- [Node.js](https://nodejs.org/) 18 ou superior;
- npm 9 ou superior;
- Um projeto no [Supabase](https://supabase.com/).

> O projeto também possui `bun.lockb`; caso prefira Bun, use `bun install` e substitua os comandos `npm run` por `bun run`.

## Instalação e execução

1. Clone o repositório e entre na pasta do projeto:

   ```bash
   git clone https://github.com/devgaps/mundorastro.git
   cd mundorastro
   ```

2. Instale as dependências:

   ```bash
   npm install
   ```

3. Crie um arquivo `.env` na raiz, a partir do exemplo abaixo:

   ```env
   VITE_SUPABASE_PROJECT_ID=seu-project-id
   VITE_SUPABASE_URL=https://seu-project-id.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=sua-chave-anon-ou-publishable
   VITE_APP_URL=http://localhost:5173
   ```

4. Aplique as migrations do Supabase, conforme a seção [Banco de dados](#banco-de-dados-supabase).

5. Inicie o ambiente de desenvolvimento:

   ```bash
   npm run dev
   ```

6. Abra a URL exibida pelo Vite — normalmente `http://localhost:5173`.

## Comandos disponíveis

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Inicia o servidor de desenvolvimento. |
| `npm run build` | Gera a versão de produção em `dist/`. |
| `npm run build:dev` | Gera o build usando o modo `development`. |
| `npm run preview` | Serve localmente o último build de produção. |
| `npm run lint` | Executa a verificação do ESLint. |

## Banco de dados (Supabase)

O Supabase fornece autenticação, banco PostgreSQL, políticas de acesso por linha (RLS) e armazenamento de documentos.

As migrations estão em [`supabase/migrations`](./supabase/migrations). Em um projeto novo, aplique-as em ordem cronológica. É possível usar a CLI do Supabase ou copiar o conteúdo de cada arquivo para o **SQL Editor** do painel do Supabase.

```bash
# Exemplo com a CLI do Supabase vinculada ao projeto
supabase db push
```

As migrations criam, entre outras, as tabelas:

`profiles`, `user_roles`, `propriedades`, `talhoes`, `safras`, `caderno_campo`, `producao`, `compras`, `estoque`, `movimentacoes_estoque`, `lotes_rastreabilidade`, `expedicao`, `financeiro`, `equipamentos`, `documentos`, `etiquetas` e `configuracoes`.

A migration operacional também cria o bucket privado `documentos` e suas políticas de acesso. Para instruções específicas, consulte [`docs/APLICAR_MIGRATIONS_SUPABASE.md`](./docs/APLICAR_MIGRATIONS_SUPABASE.md).

### Autenticação e permissões

- O acesso ao painel exige autenticação por e-mail e senha.
- O cadastro cria um perfil e atribui inicialmente o papel `operator`.
- Os papéis disponíveis são `admin`, `manager` e `operator`.
- As tabelas usam RLS para restringir os dados ao proprietário (`user_id`), com acesso administrativo quando aplicável.
- A rota `/consulta-qrcode` é pública e permite consultar um lote rastreável pelo código informado.

Para usar Google OAuth, habilite o provedor no painel do Supabase/Lovable e configure as URLs de redirecionamento de acordo com os ambientes utilizados.

## Rotas

| Rota | Acesso | Página |
| --- | --- | --- |
| `/login` | Público | Entrada e cadastro de usuários. |
| `/consulta-qrcode` | Público | Consulta de lote por código/QR Code. |
| `/dashboard` | Autenticado | Visão geral do sistema. |
| `/propriedades`, `/talhoes`, `/safras` | Autenticado | Cadastros agrícolas. |
| `/equipamentos`, `/caderno-de-campo`, `/producao` | Autenticado | Operação rural. |
| `/rastreabilidade`, `/expedicao`, `/etiquetas` | Autenticado | Gestão de lotes e envios. |
| `/estoque`, `/compras`, `/financeiro` | Autenticado | Gestão operacional e financeira. |
| `/relatorios`, `/usuarios`, `/documentos`, `/configuracoes` | Autenticado | Administração do sistema. |

## Estrutura do projeto

```text
.
├── docs/                         # Documentação técnica e de operação
├── public/                       # Arquivos estáticos
├── src/
│   ├── components/               # Componentes de interface e layout
│   ├── hooks/                    # Hooks, incluindo autenticação
│   ├── integrations/supabase/    # Cliente e tipos do Supabase
│   ├── pages/                    # Páginas e módulos do sistema
│   ├── services/                 # Acesso a dados por domínio
│   ├── App.tsx                   # Rotas e provedores da aplicação
│   └── main.tsx                  # Ponto de entrada do React
├── supabase/
│   ├── config.toml               # Configuração da CLI do Supabase
│   └── migrations/               # Evolução do banco de dados
├── .env                          # Variáveis locais (não versionar segredos)
└── package.json                  # Dependências e scripts
```

## Desenvolvimento

- Mantenha regras de negócio e consultas ao Supabase em `src/services`.
- Use TanStack Query para consultas, mutações e invalidação de cache.
- Crie uma migration para toda alteração de schema; não altere manualmente o banco sem registrar a mudança no repositório.
- Execute `npm run lint` e `npm run build` antes de enviar alterações para revisão.
- Nunca publique a chave `service_role` ou outros segredos do Supabase no front-end. As variáveis `VITE_*` são expostas no bundle do navegador.

## Problemas comuns

### A aplicação não conecta ao Supabase

Confira se `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY` estão preenchidas corretamente no `.env`. Depois de alterar variáveis de ambiente, reinicie o Vite.

### Uma tabela ou bucket não existe

Verifique se todas as migrations foram aplicadas. Para equipamentos, documentos, etiquetas e configurações, aplique especificamente a migration `20260605190000_add_operational_storage_tables.sql`.

### Erro de permissão ao consultar ou salvar dados

Confirme se o usuário está autenticado e revise as políticas RLS no Supabase. Os registros são associados ao usuário autenticado por meio de `user_id`.

## Documentação adicional

- [Plano de backend](./docs/BACKEND_PLAN.md)
- [Como aplicar as migrations do Supabase](./docs/APLICAR_MIGRATIONS_SUPABASE.md)

## Licença

Este repositório não possui uma licença declarada. Antes de redistribuir ou reutilizar o código, defina uma licença adequada com os responsáveis pelo projeto.
