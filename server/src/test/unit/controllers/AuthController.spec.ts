import { beforeEach, describe, expect, it, vi } from "vitest";

const validateUser = vi.hoisted(() => vi.fn());
vi.mock("@/infrastructure/services/AuthService", () => ({ authService: { validateUser } }));
import { authController } from "@/presentation/controllers/AuthController";

function replyMock() {
  const reply = { status: vi.fn(), send: vi.fn(), jwtSign: vi.fn() };
  reply.status.mockReturnValue(reply);
  return reply;
}

describe("AuthController", () => {
  beforeEach(() => vi.clearAllMocks());

  it("gera token para credenciais válidas", async () => {
    const reply = replyMock();
    validateUser.mockResolvedValue({ id: "user-1", name: "Admin" });
    reply.jwtSign.mockResolvedValue("jwt-token");

    await authController.login({ body: { email: "admin@example.com", password: "secret" } } as never, reply as never);

    expect(reply.jwtSign).toHaveBeenCalledWith({ name: "Admin" }, { sign: { sub: "user-1", expiresIn: "7d" } });
    expect(reply.status).toHaveBeenCalledWith(200);
    expect(reply.send).toHaveBeenCalledWith({ token: "jwt-token" });
  });

  it("responde 401 para credenciais inválidas", async () => {
    const reply = replyMock();
    validateUser.mockResolvedValue(null);

    await authController.login({ body: { email: "admin@example.com", password: "wrong" } } as never, reply as never);

    expect(reply.status).toHaveBeenCalledWith(401);
    expect(reply.send).toHaveBeenCalledWith({ message: "Credenciais inválidas" });
  });

  it("propaga exceção da autenticação", async () => {
    validateUser.mockRejectedValue(new Error("database unavailable"));

    await expect(authController.login({ body: {} } as never, replyMock() as never)).rejects.toThrow("database unavailable");
  });
});
