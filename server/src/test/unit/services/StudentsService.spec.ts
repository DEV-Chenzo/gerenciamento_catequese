import { beforeEach, describe, expect, it, vi } from "vitest";

const prismaMock = vi.hoisted(() => ({
  student: {
    createMany: vi.fn(),
    findMany: vi.fn(),
    findFirst: vi.fn(),
    deleteMany: vi.fn(),
  },
}));

vi.mock("@/infrastructure/database/lib/prisma", () => ({ prisma: prismaMock }));

import { studentServices } from "@/infrastructure/services/StudentsService";

describe("StudentServices", () => {
  beforeEach(() => vi.clearAllMocks());

  it("cria alunos em lote", async () => {
    prismaMock.student.createMany.mockResolvedValue({ count: 2 });

    const result = await studentServices.createStudents({ list: ["Ana", "Bruno"] });

    expect(prismaMock.student.createMany).toHaveBeenCalledWith({ data: [{ name: "Ana" }, { name: "Bruno" }] });
    expect(result).toEqual({ message: "Alunos criados com sucesso", totalCriado: 2 });
  });

  it("propaga falha do banco ao criar alunos", async () => {
    prismaMock.student.createMany.mockRejectedValue(new Error("database unavailable"));

    await expect(studentServices.createStudents({ list: ["Ana"] })).rejects.toThrow("database unavailable");
  });

  it("busca alunos e aplica o select esperado", async () => {
    const students = [{ id: "student-1", name: "Ana", classYear: "CURRENT", summary: null }];
    prismaMock.student.findMany.mockResolvedValue(students);

    await expect(studentServices.getStudents()).resolves.toEqual(students);
    expect(prismaMock.student.findMany).toHaveBeenCalledWith({
      select: { id: true, name: true, classYear: true, summary: { select: { totalPresents: true, totalAbsences: true } } },
    });
  });

  it("busca alunos por nome sem diferenciar maiúsculas", async () => {
    prismaMock.student.findMany.mockResolvedValue([]);

    await expect(studentServices.getStudentsByName("ana")).resolves.toEqual([]);
    expect(prismaMock.student.findMany).toHaveBeenCalledWith(expect.objectContaining({
      where: { name: { contains: "ana", mode: "insensitive" } },
      orderBy: { name: "asc" },
    }));
  });

  it("retorna o id do aluno ou null quando não existe", async () => {
    prismaMock.student.findFirst.mockResolvedValueOnce({ id: "student-1" }).mockResolvedValueOnce(null);

    await expect(studentServices.getStudentIdByName("Ana")).resolves.toBe("student-1");
    await expect(studentServices.getStudentIdByName("Inexistente")).resolves.toBeNull();
  });

  it("remove alunos em lote", async () => {
    prismaMock.student.deleteMany.mockResolvedValue({ count: 1 });

    await expect(studentServices.deleteStudents({ list: ["Ana"] })).resolves.toEqual({ message: "Alunos deletados com sucesso", totalDeletado: 1 });
    expect(prismaMock.student.deleteMany).toHaveBeenCalledWith({ where: { name: { in: ["Ana"] } } });
  });
});
