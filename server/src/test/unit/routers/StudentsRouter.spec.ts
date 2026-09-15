import { describe, expect, it, vi } from "vitest";

const controller = vi.hoisted(() => ({ create: vi.fn(), get: vi.fn(), getByName: vi.fn(), getIdByName: vi.fn(), delete: vi.fn() }));
vi.mock("@/presentation/controllers/StudentController", () => ({ studentController: controller }));
import { studentRoutes } from "@/presentation/routers/studentsRouters";

describe("studentRoutes", () => {
  it("registra todos os endpoints de alunos", async () => {
    const app = { get: vi.fn(), post: vi.fn(), delete: vi.fn() };

    await studentRoutes(app as never);

    expect(app.post).toHaveBeenCalledWith("/students", controller.create);
    expect(app.get).toHaveBeenCalledWith("/students", controller.get);
    expect(app.get).toHaveBeenCalledWith("/students/:name", controller.getByName);
    expect(app.get).toHaveBeenCalledWith("/students/id/:name", controller.getIdByName);
    expect(app.delete).toHaveBeenCalledWith("/students", controller.delete);
  });
});
