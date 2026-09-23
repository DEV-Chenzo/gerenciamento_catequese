"use client";
import { loginAction } from "@/app/actions/AuthActions";
import { useState } from "react";
export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    // Executa a ação no servidor
    const response = await loginAction(formData);

    if (response?.error) {
      setError(response.error);
      setLoading(false);
    }
  }
  return (
    <>
      <section>
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          {error && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
              {error}
            </div>
          )}
            <label htmlFor="email">Email de Acesso:</label>
            <input
              name="email"
              type="email"
              required
              placeholder="seu@email.com"
              className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-primary-hover"
            />
            <label htmlFor="password">Senha de Acesso</label>
            <input
              name="password"
              type="password"
              required
              placeholder="••••••••"
              className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-primary-hover "
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-primary hover:bg-primary-hover text-white font-bold py-2 px-4 rounded"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
        </form>
      </section>
    </>
  );
}
