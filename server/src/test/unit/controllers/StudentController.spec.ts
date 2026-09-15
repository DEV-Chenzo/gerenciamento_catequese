import { beforeEach, describe, expect, it, vi } from "vitest";

const methods = vi.hoisted(() => ({ createStudents: vi.fn(), getStudents: vi.fn(), getStudentsByName: vi.fn(), getStudentIdByName: vi.fn(), deleteStudents: vi.fn() }));
vi.mock("@/infrastructure/services/StudentsService", () => ({ studentServices: methods }));
import { studentController } from "@/presentation/controllers/StudentController";

function replyMock() {
  const reply = { status: vi.fn(), send: vi.fn() };
  reply.status.mockReturnValue(reply);
  return reply;
}

describe("StudentController", () => {
  beforeEach(() => vi.clearAllMocks());

  it("cria alunos e responde 201", async () => {
    const reply = replyMock();
    methods.createStudents.mockResolvedValue({ message: "Alunos criados com sucesso", totalCriado: 1 });

    await studentController.create({ body: { list: ["Ana"] } } as never, reply as never);

    expect(methods.createStudents).toHaveBeenCalledWith({ list: ["Ana"] });
    expect(reply.status).toHaveBeenCalledWith(201);
    expect(reply.send).toHaveBeenCalledWith({ message: "Alunos criados com sucesso", totalCriado: 1 });
  });

  it("retorna 404 ao não encontrar alunos", async () => {
    const reply = replyMock();
    methods.getStudents.mockResolvedValue([]);

    await studentController.get({} as never, reply as never);

    expect(reply.status).toHaveBeenCalledWith(404);
    expect(reply.send).toHaveBeenCalledWith({ message: "Nenhum aluno encontrado" });
  });

  it("retorna alunos encontrados por nome", async () => {
    const reply = replyMock();
    const students = [{ id: "student-1", name: "Ana" }];
    methods.getStudentsByName.mockResolvedValue(students);

    await studentController.getByName({ query: { name: "ana" } } as never, reply as never);

    expect(methods.getStudentsByName).toHaveBeenCalledWith("ana");
    expect(reply.status).toHaveBeenCalledWith(200);
    expect(reply.send).toHaveBeenCalledWith(students);
  });

  it("retorna 404 ao não encontrar o id do aluno", async () => {
    const reply = replyMock();
    methods.getStudentIdByName.mockResolvedValue(null);

    await studentController.getIdByName({ params: { name: "Inexistente" } } as never, reply as never);

    expect(reply.status).toHaveBeenCalledWith(404);
    expect(reply.send).toHaveBeenCalledWith({ message: "Aluno não encontrado" });
  });

  it("propaga falha do serviço", async () => {
    methods.deleteStudents.mockRejectedValue(new Error("database unavailable"));

    await expect(studentController.delete({ body: { list: ["Ana"] } } as never, replyMock() as never)).rejects.toThrow("database unavailable");
  });
});
