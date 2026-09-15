# Testes automatizados da API

Este documento explica a suíte de testes do backend, construída com **Vitest**, Fastify, TypeScript e mocks. O objetivo é verificar o comportamento da API rapidamente, sem iniciar uma porta HTTP real nem exigir PostgreSQL nos testes.

## Como executar

Na pasta `server`, use:

```bash
npm test
```

Para manter os testes em execução durante o desenvolvimento:

```bash
npm run teste:watch
```

Antes de executar a checagem de tipos, gere o Prisma Client quando necessário:

```bash
npm run prisma:generate
npx tsc --noEmit
```

## Estrutura

```text
server/src/test/
├── unit/
│   ├── controllers/
│   │   ├── AttendanceController.spec.ts
│   │   ├── AuthController.spec.ts
│   │   └── StudentController.spec.ts
│   ├── routers/
│   │   ├── AttendanceRouter.spec.ts
│   │   ├── AuthRouter.spec.ts
│   │   └── StudentsRouter.spec.ts
│   └── services/
│       ├── AttendanceService.spec.ts
│       ├── AuthService.spec.ts
│       └── StudentsService.spec.ts
└── integration/
    └── app.spec.ts
```

O arquivo `server/vitest.config.ts` limita a descoberta a `src/test/**/*.spec.ts`, usa ambiente Node.js e disponibiliza o alias `@`, que aponta para `server/src`. Assim, por exemplo, `@/infrastructure/services/AuthService` equivale a `src/infrastructure/services/AuthService`.

## Conceitos do Vitest usados

Um teste é organizado com `describe`, `it` e `expect`:

```ts
describe("AuthService", () => {
  it("retorna null para senha inválida", async () => {
    // Arrange: prepara o cenário
    // Act: executa o método
    // Assert: verifica o resultado
    await expect(authService.validateUser("email", "senha")).resolves.toBeNull();
  });
});
```

Os principais recursos utilizados são:

| Recurso | Uso na suíte |
| --- | --- |
| `vi.fn()` | Cria uma função simulada e permite definir retorno, erro e verificar chamadas. |
| `vi.mock()` | Substitui módulos reais, como Prisma, bcrypt ou services. |
| `vi.hoisted()` | Cria mocks antes da importação do módulo que os consome. É necessário porque `vi.mock` é elevado pelo Vitest. |
| `mockResolvedValue(...)` | Faz um mock assíncrono retornar sucesso. |
| `mockRejectedValue(...)` | Faz um mock assíncrono lançar uma exceção. |
| `beforeEach(...)` | Limpa as chamadas dos mocks antes de cada cenário. |
| `beforeAll(...)` / `afterAll(...)` | Prepara e encerra a aplicação Fastify no teste de integração. |

O padrão dos testes é AAA: **Arrange** (preparar), **Act** (executar) e **Assert** (validar).

## Testes unitários

Testes unitários exercitam uma camada de cada vez. Nenhum deles acessa o banco de dados, faz rede ou depende de outro componente real.

### Services

Os services têm Prisma e bcrypt substituídos por mocks.

| Arquivo | Cenários verificados |
| --- | --- |
| `StudentsService.spec.ts` | Criação em lote; formato da consulta de alunos; busca parcial sem distinção de maiúsculas; busca de ID existente/inexistente; exclusão; propagação de falha do banco na criação. |
| `AuthService.spec.ts` | Login válido sem expor a senha; usuário inexistente; senha inválida. Prisma e `bcrypt.compare` são simulados. |
| `AttendanceService.spec.ts` | Busca de registro; resumo para múltiplos alunos; criação de operações de presença em transação; propagação de erro da transação. |

Exemplo do princípio de isolamento:

```ts
vi.mock("@/infrastructure/database/lib/prisma", () => ({
  prisma: prismaMock,
}));
```

Esse trecho garante que uma chamada como `studentServices.createStudents(...)` use `prismaMock.student.createMany`, e não uma conexão real.

### Controllers

Os controllers são testados com um `reply` Fastify simulado. Isso permite conferir status e corpo enviados sem criar uma aplicação Fastify.

| Arquivo | Cenários verificados |
| --- | --- |
| `StudentController.spec.ts` | Criação com `201`; lista vazia com `404`; busca por nome com `200`; ID ausente com `404`; propagação de falha do service. |
| `AuthController.spec.ts` | Credenciais válidas geram JWT e `200`; inválidas retornam `401`; erro do service é propagado. |
| `AttendanceController.spec.ts` | Registro ausente com `404`; chamada em lote bem-sucedida com `200`; resultado vazio com `400`; resumo encontrado ou vazio (`200`/`404`); erro do service propagado. |

Um `reply` simulado tem o encadeamento usado pelo Fastify:

```ts
const reply = { status: vi.fn(), send: vi.fn() };
reply.status.mockReturnValue(reply);
```

Por isso o teste consegue validar `reply.status(404).send(...)` como se fosse uma resposta Fastify.

### Routers

Os routers recebem uma instância simulada que possui somente os métodos necessários (`get`, `post` e `delete`). Os testes confirmam que cada URL, verbo HTTP e handler foram registrados corretamente.

| Arquivo | Rotas verificadas |
| --- | --- |
| `StudentsRouter.spec.ts` | `POST /students`, `GET /students`, `GET /students/:name`, `GET /students/id/:name` e `DELETE /students`. |
| `AuthRouter.spec.ts` | `POST /login`, com handler associado ao contexto do controller por `bind`. |
| `AttendanceRouter.spec.ts` | `GET /attendance`, `GET /summary` e `POST /attendance`. |

## Teste de integração

O arquivo `integration/app.spec.ts` importa a instância real `App`, chama `await App.ready()` antes dos cenários e `await App.close()` ao final. As requisições são feitas por `App.inject()`:

```ts
const response = await App.inject({
  method: "POST",
  url: "/api/login",
  payload: { email: "admin@example.com", password: "secret" },
});

expect(response.statusCode).toBe(200);
expect(response.json()).toEqual({ token: expect.any(String) });
```

`inject()` percorre a configuração real do Fastify, plugins, prefixo `/api`, router e controller, sem abrir uma porta de rede. Os services continuam mockados para o teste ser determinístico e independente do banco.

Os cenários de integração cobrem:

- Login válido: `200`, `Content-Type` JSON e token JWT.
- Login inválido: `401` e `{ "message": "Credenciais inválidas" }`.
- Criação de aluno: `201` e corpo de sucesso.
- Consulta de alunos: `200` com lista esperada e `404` quando vazia.
- Consulta de presença: `200` com registro e `404` quando não encontrado.
- Registro de chamada em lote: `200` e corpo de sucesso.

## Resultado atual

Na última validação, a suíte possui **10 arquivos e 35 testes**, todos aprovados. A checagem `npx tsc --noEmit` também foi aprovada após gerar o Prisma Client.
