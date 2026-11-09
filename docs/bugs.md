# Bugs e pontos de atenção

1. **Manter Prisma CLI e Prisma Client alinhados.** Usar ambos na versão `7.10.1` neste projeto (`prisma` e `@prisma/client`). Uma divergência ou atualização isolada pode deixar o client gerado incompatível com o schema, causando erros 500 na API e falhas em cadeia na aplicação. Após alterar o schema, regenerar o client com `npm run prisma:generate` no diretório `server`.
