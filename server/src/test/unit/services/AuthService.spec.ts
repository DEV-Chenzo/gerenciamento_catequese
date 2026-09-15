import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ findUnique: vi.fn(), compare: vi.fn() }));
vi.mock("@/infrastructure/database/lib/prisma", () => ({ prisma: { user: { findUnique: mocks.findUnique } } }));
vi.mock("bcrypt", () => ({ default: { compare: mocks.compare } }));

import { authService } from "@/infrastructure/services/AuthService";

describe("AuthService", () => {
  beforeEach(() => vi.clearAllMocks());

  it("valida credenciais corretas e não retorna a senha", async () => {
    mocks.findUnique.mockResolvedValue({ id: "user-1", name: "Admin", email: "admin@example.com", password: "hash" });
    mocks.compare.mockResolvedValue(true);

    await expect(authService.validateUser("admin@example.com", "secret")).resolves.toEqual({ id: "user-1", name: "Admin", email: "admin@example.com" });
    expect(mocks.compare).toHaveBeenCalledWith("secret", "hash");
  });

  it("retorna null quando o usuário não existe", async () => {
    mocks.findUnique.mockResolvedValue(null);

    await expect(authService.validateUser("none@example.com", "secret")).resolves.toBeNull();
    expect(mocks.compare).not.toHaveBeenCalled();
  });

  it("retorna null quando a senha é inválida", async () => {
    mocks.findUnique.mockResolvedValue({ password: "hash" });
    mocks.compare.mockResolvedValue(false);

    await expect(authService.validateUser("admin@example.com", "wrong")).resolves.toBeNull();
  });
});
