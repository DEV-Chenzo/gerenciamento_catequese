import { describe, expect, it, vi } from "vitest";

const login = vi.hoisted(() => vi.fn());
vi.mock("@/presentation/controllers/AuthController", () => ({ authController: { login } }));
import { authRoutes } from "@/presentation/routers/authRouter";

describe("authRoutes", () => {
  it("registra o endpoint de login com o contexto do controller", async () => {
    const app = { post: vi.fn() };

    await authRoutes(app as never);

    expect(app.post).toHaveBeenCalledWith("/login", expect.any(Function));
    expect(app.post.mock.calls[0]?.[1]).not.toBe(login);
  });
});
