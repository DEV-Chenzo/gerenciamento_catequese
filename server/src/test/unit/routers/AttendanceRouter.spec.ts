import { describe, expect, it, vi } from "vitest";

const controller = vi.hoisted(() => ({ getRecord: vi.fn(), getSummary: vi.fn(), createBulkAttendance: vi.fn() }));
vi.mock("@/presentation/controllers/AttendanceController", () => ({ attendanceController: controller }));
import { attendanceRoutes } from "@/presentation/routers/attendanceRouter";

describe("attendanceRoutes", () => {
  it("registra todos os endpoints de presença", async () => {
    const app = { get: vi.fn(), post: vi.fn() };

    await attendanceRoutes(app as never);

    expect(app.get).toHaveBeenCalledWith("/attendance", controller.getRecord);
    expect(app.get).toHaveBeenCalledWith("/summary", controller.getSummary);
    expect(app.post).toHaveBeenCalledWith("/attendance", controller.createBulkAttendance);
  });
});
