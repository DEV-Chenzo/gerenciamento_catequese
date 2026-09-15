import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  findManyRecord: vi.fn(), findManySummary: vi.fn(), upsertRecord: vi.fn(), upsertSummary: vi.fn(), transaction: vi.fn(),
}));
vi.mock("@/infrastructure/database/lib/prisma", () => ({ prisma: {
  attendanceRecord: { findMany: mocks.findManyRecord, upsert: mocks.upsertRecord },
  attendanceSummary: { findMany: mocks.findManySummary, upsert: mocks.upsertSummary },
  $transaction: mocks.transaction,
} }));

import { attendanceService } from "@/infrastructure/services/AttendanceService";

describe("AttendanceService", () => {
  beforeEach(() => vi.clearAllMocks());

  it("consulta um registro de presença", async () => {
    const date = new Date("2026-09-01");
    mocks.findManyRecord.mockResolvedValue([{ id: "record-1" }]);

    await expect(attendanceService.getAttendanceRecord("record-1", date)).resolves.toEqual([{ id: "record-1" }]);
    expect(mocks.findManyRecord).toHaveBeenCalledWith({ where: { id: "record-1", date } });
  });

  it("consulta os resumos de cada aluno", async () => {
    mocks.findManySummary.mockResolvedValue([{ studentId: "student-1" }]);

    await expect(attendanceService.getAttendanceSummary(["student-1", "student-2"])).resolves.toEqual([[{ studentId: "student-1" }], [{ studentId: "student-1" }]]);
    expect(mocks.findManySummary).toHaveBeenCalledTimes(2);
  });

  it("registra chamada em transação", async () => {
    mocks.upsertRecord.mockReturnValueOnce("record-operation");
    mocks.upsertSummary.mockReturnValueOnce("summary-operation");
    mocks.transaction.mockResolvedValue([]);

    await expect(attendanceService.registerBulkAttendance({ date: "2026-09-01", classYear: "CURRENT" as never, records: [{ studentId: "student-1", present: true }] })).resolves.toEqual({ message: "Chamada registrada com sucesso", totalProcessado: 1 });
    expect(mocks.transaction).toHaveBeenCalledWith(["record-operation", "summary-operation"]);
  });

  it("propaga erro da transação", async () => {
    mocks.upsertRecord.mockReturnValue("record-operation");
    mocks.upsertSummary.mockReturnValue("summary-operation");
    mocks.transaction.mockRejectedValue(new Error("transaction failed"));

    await expect(attendanceService.registerBulkAttendance({ date: "2026-09-01", classYear: "CURRENT" as never, records: [{ studentId: "student-1", present: false }] })).rejects.toThrow("transaction failed");
  });
});
