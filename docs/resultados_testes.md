# Resultados dos testes do servidor

## Resumo da execução

Os testes foram executados em `server` com:

```bash
npm test -- --reporter=verbose
```

Resultado obtido:

- Arquivos de teste: **10 aprovados**
- Casos de teste: **35 aprovados**
- Falhas: **0**
- Duração: **6,81 s**

Os testes unitários utilizam mocks para simular serviços, banco de dados e controllers. Portanto, eles verificam o comportamento e os contratos entre as camadas, sem necessariamente acessar um banco real.

## Testes de integração da API

Arquivo: `server/src/test/integration/app.spec.ts`

1. **Realiza login e retorna um JWT**
   - Verifica: `POST /api/login` com credenciais válidas.
   - Resultado esperado: HTTP `200`, resposta JSON e objeto no formato `{ token: string }`.
   - Resultado obtido: **aprovado**; a API retornou HTTP `200` e um token JWT.

2. **Retorna 401 para login inválido**
   - Verifica: `POST /api/login` quando o serviço não valida o usuário.
   - Resultado esperado: HTTP `401` e `{ message: "Credenciais inválidas" }`.
   - Resultado obtido: **aprovado**; a API retornou HTTP `401` com a mensagem esperada.

3. **Cria e consulta alunos**
   - Verifica: criação por `POST /api/students` e consulta por `GET /api/students`.
   - Resultado esperado: criação com HTTP `201` e retorno de sucesso; consulta com HTTP `200` e a lista de alunos.
   - Resultado obtido: **aprovado**; foram observados HTTP `201` e HTTP `200`, com os payloads esperados.

4. **Retorna 404 quando não há alunos**
   - Verifica: `GET /api/students` quando o serviço retorna uma lista vazia.
   - Resultado esperado: HTTP `404` e `{ message: "Nenhum aluno encontrado" }`.
   - Resultado obtido: **aprovado**; a API retornou HTTP `404` com a mensagem esperada.

5. **Consulta e registra presença**
   - Verifica: consulta por `GET /api/attendance?id=record-1` e registro por `POST /api/attendance`.
   - Resultado esperado: consulta com HTTP `200` e o registro; registro com HTTP `200` e mensagem de sucesso.
   - Resultado obtido: **aprovado**; ambos os endpoints retornaram HTTP `200` com os dados esperados.

6. **Retorna 404 para presença não encontrada**
   - Verifica: consulta de presença inexistente em `GET /api/attendance`.
   - Resultado esperado: HTTP `404` e `{ message: "Registro de presença não encontrado" }`.
   - Resultado obtido: **aprovado**; a API retornou HTTP `404` com a mensagem esperada.

## Testes dos controllers

### AttendanceController

Arquivo: `server/src/test/unit/controllers/AttendanceController.spec.ts`

1. **Retorna 404 quando não há registro de presença**
   - Esperado: enviar HTTP `404` com a mensagem de registro não encontrado.
   - Obtido: **aprovado**; `reply.status(404)` e `reply.send(...)` foram chamados corretamente.

2. **Registra chamada em lote**
   - Esperado: encaminhar o corpo ao serviço e responder HTTP `200`.
   - Obtido: **aprovado**; o serviço recebeu o corpo correto e o controller respondeu HTTP `200`.

3. **Retorna 400 para resultado vazio no registro em lote**
   - Esperado: responder HTTP `400` com `"Falha ao registrar a chamada em lote"` quando o serviço retorna objeto vazio.
   - Obtido: **aprovado**; status e mensagem foram enviados corretamente.

4. **Retorna resumo ou 404 quando vazio**
   - Esperado: responder HTTP `200` quando há resumo e HTTP `404` quando o resultado está vazio.
   - Obtido: **aprovado**; as duas situações produziram os status esperados.

5. **Propaga exceção do serviço**
   - Esperado: não esconder o erro lançado pelo serviço.
   - Obtido: **aprovado**; a exceção `database unavailable` foi propagada.

### AuthController

Arquivo: `server/src/test/unit/controllers/AuthController.spec.ts`

1. **Gera token para credenciais válidas**
   - Esperado: gerar JWT com o usuário, assunto `user-1`, validade de `7d`, e responder HTTP `200` com o token.
   - Obtido: **aprovado**; `jwtSign` recebeu as opções esperadas e a resposta foi `{ token: "jwt-token" }`.

2. **Responde 401 para credenciais inválidas**
   - Esperado: responder HTTP `401` com `"Credenciais inválidas"`.
   - Obtido: **aprovado**; status e mensagem foram enviados corretamente.

3. **Propaga exceção da autenticação**
   - Esperado: propagar uma falha do serviço de autenticação.
   - Obtido: **aprovado**; a exceção `database unavailable` foi propagada.

### StudentController

Arquivo: `server/src/test/unit/controllers/StudentController.spec.ts`

1. **Cria alunos e responde 201**
   - Esperado: encaminhar a lista ao serviço e responder HTTP `201` com o total criado.
   - Obtido: **aprovado**; o serviço recebeu `{ list: ["Ana"] }` e o retorno foi enviado corretamente.

2. **Retorna 404 ao não encontrar alunos**
   - Esperado: responder HTTP `404` com `"Nenhum aluno encontrado"`.
   - Obtido: **aprovado**; status e mensagem foram enviados corretamente.

3. **Retorna alunos encontrados por nome**
   - Esperado: consultar o nome recebido e responder HTTP `200` com os alunos.
   - Obtido: **aprovado**; o nome foi encaminhado ao serviço e a lista retornada corretamente.

4. **Retorna 404 ao não encontrar o id do aluno**
   - Esperado: responder HTTP `404` com `"Aluno não encontrado"`.
   - Obtido: **aprovado**; status e mensagem foram enviados corretamente.

5. **Propaga falha do serviço**
   - Esperado: não esconder uma falha ocorrida ao excluir alunos.
   - Obtido: **aprovado**; a exceção `database unavailable` foi propagada.

## Testes dos services

### AttendanceService

Arquivo: `server/src/test/unit/services/AttendanceService.spec.ts`

1. **Consulta um registro de presença**
   - Esperado: buscar pelo identificador e pela data informados e devolver os registros encontrados.
   - Obtido: **aprovado**; o resultado foi devolvido e o Prisma recebeu o filtro `{ id: "record-1", date }`.

2. **Consulta os resumos de cada aluno**
   - Esperado: consultar o resumo para cada identificador recebido.
   - Obtido: **aprovado**; foram feitas duas consultas e o resultado foi retornado para os dois alunos.

3. **Registra chamada em transação**
   - Esperado: criar as operações de presença e resumo, executá-las em transação e retornar o total processado.
   - Obtido: **aprovado**; a transação recebeu as duas operações e o retorno foi `{ message: "Chamada registrada com sucesso", totalProcessado: 1 }`.

4. **Propaga erro da transação**
   - Esperado: propagar a falha ocorrida durante a transação.
   - Obtido: **aprovado**; a exceção `transaction failed` foi propagada.

### AuthService

Arquivo: `server/src/test/unit/services/AuthService.spec.ts`

1. **Valida credenciais corretas e não retorna a senha**
   - Esperado: comparar a senha informada com o hash e retornar apenas `id`, `name` e `email`.
   - Obtido: **aprovado**; a comparação foi feita com os valores corretos e a senha não apareceu no retorno.

2. **Retorna null quando o usuário não existe**
   - Esperado: retornar `null` sem tentar comparar senha.
   - Obtido: **aprovado**; o retorno foi `null` e `bcrypt.compare` não foi chamado.

3. **Retorna null quando a senha é inválida**
   - Esperado: retornar `null` quando a comparação da senha falhar.
   - Obtido: **aprovado**; o retorno foi `null`.

### StudentsService

Arquivo: `server/src/test/unit/services/StudentsService.spec.ts`

1. **Cria alunos em lote**
   - Esperado: transformar a lista de nomes em dados do Prisma e retornar a quantidade criada.
   - Obtido: **aprovado**; `createMany` recebeu Ana e Bruno e o retorno informou `totalCriado: 2`.

2. **Propaga falha do banco ao criar alunos**
   - Esperado: propagar o erro de banco durante a criação.
   - Obtido: **aprovado**; a exceção `database unavailable` foi propagada.

3. **Busca alunos e aplica o select esperado**
   - Esperado: consultar alunos selecionando `id`, `name`, `classYear` e os totais do resumo.
   - Obtido: **aprovado**; o select esperado foi enviado ao Prisma e os alunos foram retornados.

4. **Busca alunos por nome sem diferenciar maiúsculas**
   - Esperado: pesquisar com `contains`, modo `insensitive`, e ordenar por nome crescente.
   - Obtido: **aprovado**; o filtro e a ordenação esperados foram enviados ao Prisma.

5. **Retorna o id do aluno ou null quando não existe**
   - Esperado: devolver o ID quando o aluno existe e `null` quando não existe.
   - Obtido: **aprovado**; retornou `student-1` para Ana e `null` para Inexistente.

6. **Remove alunos em lote**
   - Esperado: excluir pelos nomes informados e retornar a quantidade removida.
   - Obtido: **aprovado**; `deleteMany` recebeu o filtro correto e o retorno informou `totalDeletado: 1`.

## Testes dos routers

### authRoutes

Arquivo: `server/src/test/unit/routers/AuthRouter.spec.ts`

1. **Registra o endpoint de login com o contexto do controller**
   - Esperado: registrar `POST /login` com uma função adaptadora que preserve o contexto do controller.
   - Obtido: **aprovado**; a rota foi registrada e a função usada não era a referência direta do método `login`.

### attendanceRoutes

Arquivo: `server/src/test/unit/routers/AttendanceRouter.spec.ts`

1. **Registra todos os endpoints de presença**
   - Esperado: registrar `GET /attendance`, `GET /summary` e `POST /attendance` apontando para os métodos correspondentes.
   - Obtido: **aprovado**; os três endpoints foram registrados com os controllers corretos.

### studentRoutes

Arquivo: `server/src/test/unit/routers/StudentsRouter.spec.ts`

1. **Registra todos os endpoints de alunos**
   - Esperado: registrar `POST /students`, `GET /students`, `GET /students/:name`, `GET /students/id/:name` e `DELETE /students`.
   - Obtido: **aprovado**; os cinco endpoints foram registrados com os controllers correspondentes.
