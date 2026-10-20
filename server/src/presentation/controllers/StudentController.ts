import { FastifyRequest, FastifyReply } from "fastify";
import { studentServices } from "../../infrastructure/services/StudentsService";
import { StudentsList } from "@/domain/entities/StudentList";
 class StudentController {
  async create(request: FastifyRequest, reply: FastifyReply) {
    const data = request.body as StudentsList;
    if (!data || !Array.isArray(data.list)) {
      return reply.status(400).send({ message: "O campo 'list' deve ser uma lista de alunos" });
    }
    const result = await studentServices.createStudents(data);
    return reply.status(201).send(result);
  }
  async get(request: FastifyRequest, reply: FastifyReply){
    const students = await studentServices.getStudents();
    if(!students || students.length === 0) {
      return reply.status(404).send({ message: "Nenhum aluno encontrado" });
    }
    return reply.status(200).send(students);
  }
  async getByName(request: FastifyRequest, reply: FastifyReply) {
    const { name } = request.query as { name: string };
    const students = await studentServices.getStudentsByName(name ?? "");
    if(!students || students.length === 0) {
      return reply.status(404).send({ message: "Nenhum aluno encontrado" });
    }
    return reply.status(200).send(students);
  }

  async getIdByName(request: FastifyRequest, reply: FastifyReply) {
    const { name } = request.params as { name: string };
    const studentId = await studentServices.getStudentIdByName(name);
    if (!studentId) {
      return reply.status(404).send({ message: "Aluno não encontrado" });
    }
    return reply.status(200).send({ id: studentId });
  }

  async delete(request: FastifyRequest, reply: FastifyReply) {
    const data = request.body as StudentsList;
    const result = await studentServices.deleteStudents(data);
    return reply.status(200).send(result);
  }
}

export const studentController = new StudentController();
