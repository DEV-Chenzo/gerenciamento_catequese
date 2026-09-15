import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

const services = vi.hoisted(() => {
  process.env.JWT_SECRET = "test-secret";
  return {
    validateUser: vi.fn(),
    createStudents: vi.fn(), getStudents: vi.fn(), getStudentsByName: vi.fn(), getStudentIdByName: vi.fn(), deleteStudents: vi.fn(),
    getAttendanceRecord: vi.fn(), registerBulkAttendance: vi.fn(), getAttendanceSummary: vi.fn(),
  };
});

vi.mock("@/infrastructure/services/AuthService", () => ({ authService: { validateUser: services.validateUser } }));
vi.mock("@/infrastructure/services/StudentsService", () => ({ studentServices: {
  createStudents: services.createStudents, getStudents: services.getStudents, getStudentsByName: services.getStudentsByName,
  getStudentIdByName: services.getStudentIdByName, deleteStudents: services.deleteStudents,
} }));
vi.mock("@/infrastructure/services/AttendanceService", () => ({ attendanceService: {
  getAttendanceRecord: services.getAttendanceRecord, registerBulkAttendance: services.registerBulkAttendance, getAttendanceSummary: services.getAttendanceSummary,
} }));

import { App } from "@/app";

describe("API", () => {
  beforeAll(async () => { await App.ready(); });
  beforeEach(() => vi.clearAllMocks());
  afterAll(async () => { await App.close(); });

  it("realiza login e retorna um JWT", async () => {
    services.validateUser.mockResolvedValue({ id: "user-1", name: "Admin", email: "admin@example.com" });

    const response = await App.inject({ method: "POST", url: "/api/login", payload: { email: "admin@example.com", password: "secret" } });

    expect(response.statusCode).toBe(200);
    expect(response.headers["content-type"]).toMatch(/^application\/json/);
    expect(response.json()).toEqual({ token: expect.any(String) });
  });

  it("retorna 401 para login inválido", async () => {
    services.validateUser.mockResolvedValue(null);

    const response = await App.inject({ method: "POST", url: "/api/login", payload: { email: "admin@example.com", password: "wrong" } });

    expect(response.statusCode).toBe(401);
    expect(response.headers["content-type"]).toMatch(/^application\/json/);
    expect(response.json()).toEqual({ message: "Credenciais inválidas" });
  });

  it("cria e consulta alunos", async () => {
    services.createStudents.mockResolvedValue({ message: "Alunos criados com sucesso", totalCriado: 1 });
    services.getStudents.mockResolvedValue([{ id: "student-1", name: "Ana", classYear: "CURRENT", summary: null }]);

    const creation = await App.inject({ method: "POST", url: "/api/students", payload: { list: ["Ana"] } });
    const query = await App.inject({ method: "GET", url: "/api/students" });

    expect(creation.statusCode).toBe(201);
    expect(creation.json()).toEqual({ message: "Alunos criados com sucesso", totalCriado: 1 });
    expect(query.statusCode).toBe(200);
    expect(query.json()).toEqual([{ id: "student-1", name: "Ana", classYear: "CURRENT", summary: null }]);
  });

  it("retorna 404 quando não há alunos", async () => {
    services.getStudents.mockResolvedValue([]);

    const response = await App.inject({ method: "GET", url: "/api/students" });

    expect(response.statusCode).toBe(404);
    expect(response.headers["content-type"]).toMatch(/^application\/json/);
    expect(response.json()).toEqual({ message: "Nenhum aluno encontrado" });
  });

  it("consulta e registra presença", async () => {
    services.getAttendanceRecord.mockResolvedValue([{ id: "record-1", present: true }]);
    services.registerBulkAttendance.mockResolvedValue({ message: "Chamada registrada com sucesso", totalProcessado: 1 });

    const record = await App.inject({ method: "GET", url: "/api/attendance?id=record-1" });
    const registration = await App.inject({ method: "POST", url: "/api/attendance", payload: { date: "2026-09-01", classYear: "CURRENT", records: [{ studentId: "student-1", present: true }] } });

    expect(record.statusCode).toBe(200);
    expect(record.json()).toEqual([{ id: "record-1", present: true }]);
    expect(registration.statusCode).toBe(200);
    expect(registration.json()).toEqual({ message: "Chamada registrada com sucesso", totalProcessado: 1 });
  });

  it("retorna 404 para presença não encontrada", async () => {
    services.getAttendanceRecord.mockResolvedValue([]);

    const response = await App.inject({ method: "GET", url: "/api/attendance?id=record-1" });

    expect(response.statusCode).toBe(404);
    expect(response.json()).toEqual({ message: "Registro de presença não encontrado" });
  });
});
