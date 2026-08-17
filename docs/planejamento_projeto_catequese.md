# Planejamento Técnico do Projeto: Gerenciador de Presença - Catequese

Este documento apresenta a arquitetura, modelagem de banco de dados, regras de negócio e plano de execução para o sistema de gerenciamento de presença da catequese. O projeto adota uma arquitetura desacoplada (Backend e Frontend separados), utilizando **Next.js**, **Node.js com Fastify**, **PostgreSQL** hospedado no **Supabase** e **Redis** para caching.

---

## 1. Visão Geral da Arquitetura

```
+-----------------------------------------------------------------------+
|                               FRONTEND                                |
|                        Next.js (App Router)                           |
|               Tailwind CSS, TypeScript, React Query                   |
+-----------------------------------+-----------------------------------+
                                    |
                                HTTP / REST API (JWT em Cookie HTTP-Only)
                                    |
+-----------------------------------v-----------------------------------+
|                               BACKEND                                 |
|                       Node.js + Fastify + Zod                         |
|                         TypeScript, Prisma ORM                        |
+----------------─┬─────────────────────────────────┬-------------------+
                  |                                 |
           Cache Hit / Miss                   Query & Commit
                  |                                 |
+-----------------v---------------+       +---------v-------------------+
|              REDIS              |       |   POSTGRESQL (Supabase)     |
|       Cache In-Memory (RAM)     |       |   Armazenamento Persistente |
+---------------------------------+       +-----------------------------+
```

### Principais Decisões Técnicas

| Componente          | Tecnologia                    | Justificativa Técnica                                                                                                                      |
| :------------------ | :---------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------- |
| **Frontend**        | **Next.js (App Router) + TS** | Renderização híbrida (SSR/CSR), excelente performance, roteamento intuitivo e ecossistema maduro.                                          |
| **Styling**         | **Tailwind CSS**              | Agilidade no desenvolvimento de interfaces responsivas e limpas sem acoplamento de CSS externo.                                            |
| **Backend**         | **Node.js + Fastify**         | Fastify oferece até 2x mais requisições por segundo em relação ao Express, com menor _overhead_ de memória e validação nativa de esquemas. |
| **ORM**             | **Prisma ORM**                | _Type-safety_ de ponta a ponta, fácil gerenciamento de migrations e forte suporte a scripts de _seeding_.                                  |
| **Banco de Dados**  | **PostgreSQL (Supabase)**     | Banco relacional robusto e maduro. Hospedagem gerenciada no Supabase garante infraestrutura escalável e backups automáticos.               |
| **Cache**           | **Redis**                     | Armazenamento chave-valor em memória RAM para aceleração de leituras frequentes de chamadas e listas de alunos.                            |
| **Containerização** | **Docker Compose**            | Padronização dos ambientes de desenvolvimento local (PostgreSQL local e Redis em containers).                                              |

---

## 2. Modelagem do Banco de Dados (Prisma Schema)

Para atender ao requisito de gerenciamento da turma **Aual** (`CURRENT`) e da **Próxima Turma** (`NEXT`), utiliza-se o enum `ClassYear` em vez de duplicar tabelas estruturais. Isso mantém o esquema normalizado e simplifica a manutenção.

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum ClassYear {
  CURRENT
  NEXT
}

model User {
  id        String   @id @default(uuid())
  name      String
  email     String   @unique
  password  String
  createdAt DateTime @default(now()) @map("created_at")

  @@map("users")
}

model Student {
  id        String    @id @default(uuid())
  name      String
  classYear ClassYear @default(CURRENT) @map("class_year")
  createdAt DateTime  @default(now()) @map("created_at")

  attendances AttendanceRecord[]
  summary     AttendanceSummary?

  @@map("students")
}

model AttendanceRecord {
  id        String    @id @default(uuid())
  studentId String    @map("student_id")
  date      DateTime  @db.Date
  present   Boolean
  classYear ClassYear @map("class_year")

  student   Student   @relation(fields: [studentId], references: [id], onDelete: Cascade)

  @@unique([studentId, date])
  @@map("attendance_records")
}

model AttendanceSummary {
  id            String  @id @default(uuid())
  studentId     String  @unique @map("student_id")
  totalPresents Int     @default(0) @map("total_presents")
  totalAbsences Int     @default(0) @map("total_absences")

  student       Student @relation(fields: [studentId], references: [id], onDelete: Cascade)

  @@map("attendance_summaries")
}
```

---

## 3. Autenticação e Provisionamento de Usuários

Conforme as regras de negócio:

- **Sem Cadastro Aberto**: Apenas catequistas pré-cadastrados têm acesso ao sistema.
- **Script de Seed (`prisma/seed.ts`)**: Responsável por criar os catequistas iniciais no banco de dados com senhas criptografadas via `bcrypt` (fator de custo 10 ou superior).

```typescript
// prisma/seed.ts (Exemplo conceitual)
import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("SenhaSegura123!", 10);

  await prisma.user.upsert({
    where: { email: "catequista@igreja.org" },
    update: {},
    create: {
      name: "Catequista Principal",
      email: "catequista@igreja.org",
      password: hashedPassword,
    },
  });
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
```

---

## 4. Estratégia do Sistema de Cache (Redis)

O Redis é empregado no padrão **Cache-Aside** para consultas e **Write-Through Invalidation** em operações de escrita.

```
                  ┌────────────────────────┐
                  │    Consulta da Lista   │
                  └───────────┬────────────┘
                              │
                    [ Existe no Redis? ]
                     /                \
             (SIM)  /                  \ (NÃO)
                   v                    v
           Retorna do Redis     Busca no PostgreSQL
            (Latência ~2ms)     Grava no Redis (TTL 1h)
                                Retorna do PostgreSQL
                                (Latência ~50ms)
```

### Chaves de Cache Utilizadas:

- `students:CURRENT`: Armazena a lista formatada de alunos da turma atual com seus resumos de faltas/presenças.
- `students:NEXT`: Armazena a lista de alunos pré-cadastrados para o próximo ano.

### Ciclo de Invalidação do Cache:

1. **Adicionar/Remover Alunos**: Invalida a chave `students:<CLASS_YEAR>` correspondente.
2. **Salvar Chamada (Lista de Presença)**:
   - Executa a gravação em lote dentro de uma **transação no Prisma** (`prisma.$transaction`).
   - Atualiza a tabela `AttendanceRecord` e incrementa/decremanta os contadores na `AttendanceSummary`.
   - Executa a remoção do cache (`redis.del("students:<CLASS_YEAR>")`).

---

## 5. Especificação dos Endpoints RESTful

### Autenticação

- `POST /api/auth/login`
  - **Payload**: `{ "email": "...", "password": "..." }`
  - **Resposta**: Retorna cookie HTTP-Only com token JWT e dados públicos do usuário.
- `POST /api/auth/logout`
  - **Efeito**: Limpa o cookie HTTP-Only da sessão.

### Gerenciamento de Alunos

- `GET /api/students?year=CURRENT|NEXT`
  - **Efeito**: Retorna a lista de alunos e contadores de presença. Utiliza verificação prévia no Redis.
- `POST /api/students`
  - **Payload**: `{ "names": ["Aluno A", "Aluno B"], "classYear": "CURRENT" }`
  - **Efeito**: Cria os alunos, inicializa a tabela `AttendanceSummary` com 0 presenças e 0 faltas, e invalida o cache.
- `DELETE /api/students/:id`
  - **Efeito**: Remove o aluno e seus registros vinculados via exclusão em cascata. Invalida o cache.

### Lançamento de Presença (Register)

- `POST /api/attendance`
  - **Payload**:
    ```json
    {
      "date": "2026-08-17",
      "classYear": "CURRENT",
      "records": [
        { "studentId": "uuid-1", "present": true },
        { "studentId": "uuid-2", "present": false }
      ]
    }
    ```
  - **Efeito**: Grava os registros do dia na transação do banco, recalcula a `AttendanceSummary` e apaga o cache da turma.

---

## 6. Estrutura Diretorias do Projeto

```text
catequese-presence-app/
├── docker-compose.yml
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   ├── src/
│   │   ├── config/
│   │   │   ├── env.ts
│   │   │   ├── redis.ts
│   │   │   └── database.ts
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   ├── students/
│   │   │   └── attendance/
│   │   └── server.ts
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
└── frontend/
    ├── src/
    │   ├── app/
    │   │   ├── (auth)/login/page.tsx
    │   │   ├── (dashboard)/
    │   │   │   ├── turma-atual/page.tsx
    │   │   │   └── proxima-turma/page.tsx
    │   │   └── layout.tsx
    │   ├── components/
    │   │   ├── ui/
    │   │   ├── AttendanceList.tsx
    │   │   └── StudentModal.tsx
    │   ├── services/
    │   │   └── api.ts
    │   └── lib/
    ├── package.json
    └── tailwind.config.js
```

---

## 7. Roteiro de Execução (Roadmap de Desenvolvimento)

### Fase 1: Setup da Infraestrutura e Banco

1. Configurar o arquivo `docker-compose.yml` para rodar PostgreSQL local e Redis.
2. Iniciar o projeto backend com Fastify, TypeScript e Prisma.
3. Escrever o `schema.prisma` e aplicar a migration inicial no Supabase.
4. Desenvolver e testar o script de seed (`prisma/seed.ts`) com os dados do catequista.

### Fase 2: Desenvolvimento do Backend

1. Implementar o serviço de autenticação JWT e rota de login.
2. Criar os módulos de gerenciamento de alunos (CRUD) com sincronização em `AttendanceSummary`.
3. Implementar a rota de lançamento de presença com transações no Prisma.
4. Integrar o Redis para cache nas rotas de listagem e invalidação nas atualizações.

### Fase 3: Desenvolvimento do Frontend

1. Iniciar o projeto Next.js com App Router e Tailwind CSS.
2. Criar as telas de Login e controle de autenticação por rotas protegidas.
3. Desenvolver a interface da **Lista de Chamada (Register)** com alternância simples entre Turma Atual e Próxima Turma.
4. Implementar os modais para adição e remoção individual ou em lote de alunos.

### Fase 4: Testes e Deploy

1. Testar o fluxo de perda/recuperação de cache com Redis e PostgreSQL.
2. Executar testes funcionais do lançamento de faltas e presenças.
3. Realizar o deploy do backend em serviços como Render/Railway e do frontend na Vercel, apontando para o banco Supabase.
