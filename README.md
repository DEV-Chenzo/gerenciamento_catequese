# Gerenciamento de Catequese

Aplicação composta por uma API Fastify (`server`), um front-end Next.js
(`client`) e um banco PostgreSQL executado com Docker.

## Pré-requisitos

- [Node.js](https://nodejs.org/) 20 ou superior (inclui o npm);
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) em execução.

## Executar o projeto do início ao fim

Abra terminais separados para a API e o front-end. Todos os comandos abaixo
devem ser executados a partir da raiz do repositório, salvo quando indicado.

### 1. Instale as dependências

```bash
cd server
npm install
cd ../client
npm install
cd ..
```

### 2. Gere o Prisma Client

O Prisma Client precisa existir antes de a API e a seed acessarem o banco.

```bash
cd server
npm run prisma:generate
```

### 3. Configure as portas e o ambiente da API

A API e o banco não podem usar a mesma porta no computador. A API já usa a
porta `5000`, portanto exponha o PostgreSQL na porta `5432`. No arquivo
`server/docker-compose.yml`, deixe o mapeamento assim:

```yml
ports:
  - "5432:5432"
```

Em seguida, configure `server/.env` com a porta do banco e uma chave JWT
segura:

```env
DATABASE_URL="postgresql://catequese:catequese@localhost:5432/catequese?schema=public"
JWT_SECRET="defina-um-segredo-seguro"
FRONTEND_URL="http://localhost:3000"
```

### 4. Inicie o banco de dados com Docker

Ainda no diretório `server`, suba o PostgreSQL:

```bash
npm run db:up
```

O banco ficará acessível em `localhost:5432`. Para conferir se o contêiner
está em execução, use `docker compose ps`.

### 5. Aplique as migrations e execute a seed

A seed requer que o banco Docker esteja iniciado. Execute:

```bash
npm run prisma:migrate
npx prisma db seed
```

A seed cria, ou atualiza sem duplicar, o usuário inicial:

| Campo | Valor |
| --- | --- |
| E-mail | `admin@catequese.com` |
| Senha | `SenhaSegura123` |

### 6. Inicie a API

No primeiro terminal, dentro de `server`, execute:

```bash
npm run dev
```

A API inicia em `http://localhost:5000`.

### 7. Inicie o front-end

No segundo terminal, execute:

```bash
cd client
npm run dev
```

Abra `http://localhost:3000` no navegador. O front-end se comunica com a API
local em `http://127.0.0.1:5000`.

## Encerrar o banco

Para parar o PostgreSQL quando terminar, dentro de `server` execute:

```bash
npm run db:down
```

Esse comando preserva os dados no volume Docker. Para removê-los também, use
`docker compose down -v` conscientemente.
