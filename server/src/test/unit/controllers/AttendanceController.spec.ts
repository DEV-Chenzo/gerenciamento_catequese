import { beforeEach, describe, expect, it, vi } from "vitest";

const methods = vi.hoisted(() => ({ getAttendanceRecord: vi.fn(), registerBulkAttendance: vi.fn(), getAttendanceSummary: vi.fn() }));
vi.mock("@/infrastructure/services/AttendanceService", () => ({ attendanceService: methods }));
import { attendanceController } from "@/presentation/controllers/AttendanceController";

function replyMock() {
  const reply = { status: vi.fn(), send: vi.fn() };
  reply.status.mockReturnValue(reply);
  return reply;
}

describe("AttendanceController", () => {
  beforeEach(() => vi.clearAllMocks());

  it("retorna 404 quando não há registro de presença", async () => {
    const reply = replyMock();
    methods.getAttendanceRecord.mockResolvedValue([]);

    await attendanceController.getRecord({ query: { id: "record-1" } } as never, reply as never);

    expect(reply.status).toHaveBeenCalledWith(404);
    expect(reply.send).toHaveBeenCalledWith({ message: "Registro de presença não encontrado" });
  });

  it("registra chamada em lote", async () => {
    const reply = replyMock();
    const body = { date: "2026-09-01", classYear: "CURRENT", records: [] };
    methods.registerBulkAttendance.mockResolvedValue({ message: "Chamada registrada com sucesso", totalProcessado: 0 });

    await attendanceController.createBulkAttendance({ body } as never, reply as never);

    expect(methods.registerBulkAttendance).toHaveBeenCalledWith(body);
    expect(reply.status).toHaveBeenCalledWith(200);
  });

  it("retorna 400 para resultado vazio no registro em lote", async () => {
    const reply = replyMock();
    methods.registerBulkAttendance.mockResolvedValue({});

    await attendanceController.createBulkAttendance({ body: {} } as never, reply as never);

    expect(reply.status).toHaveBeenCalledWith(400);
    expect(reply.send).toHaveBeenCalledWith({ message: "Falha ao registrar a chamada em lote" });
  });

  it("retorna resumo ou 404 quando vazio", async () => {
    const reply = replyMock();
    methods.getAttendanceSummary.mockResolvedValueOnce([[{ studentId: "student-1" }]]).mockResolvedValueOnce([]);

    await attendanceController.getSummary({ query: { recordsId: ["student-1"] } } as never, reply as never);
    expect(reply.status).toHaveBeenLastCalledWith(200);
    await attendanceController.getSummary({ query: { recordsId: [] } } as never, reply as never);
    expect(reply.status).toHaveBeenLastCalledWith(404);
  });

  it("propaga exceção do serviço", async () => {
    methods.getAttendanceRecord.mockRejectedValue(new Error("database unavailable"));

    await expect(attendanceController.getRecord({ query: { id: "record-1" } } as never, replyMock() as never)).rejects.toThrow("database unavailable");
  });
});
