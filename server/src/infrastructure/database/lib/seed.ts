import { prisma } from "./prisma";
import bcrypt from "bcrypt";

async function main() {
  const hashedPassword = await bcrypt.hash("SenhaSegura123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@catequese.com" },
    update: {},
    create: {
      email: "admin@catequese.com",
      name: "Catequista Admin",
      password: hashedPassword,
    },
  });

  console.log("Usuário pré-cadastrado com sucesso:", admin.email);
}

(async () => {
  try {
    await main();
  } catch (e) {
    console.error("Erro no seed:", e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
})();