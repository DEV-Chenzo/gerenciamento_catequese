import { FastifyInstance } from "fastify";
import { studentController } from "../controllers/StudentController";

export async function studentRoutes(app: FastifyInstance) {
  // Criar alunos em lote
  app.post("/students", studentController.create);

  // Buscar alunos por nome (query param: /students?name=Robert)
  app.get("/students", studentController.getByName);

  // Buscar ID de um aluno por nome (route param: /students/id/Robert)
  app.get("/students/id/:name", studentController.getIdByName);

  // Deletar alunos em lote
  app.delete("/students", studentController.delete);
}