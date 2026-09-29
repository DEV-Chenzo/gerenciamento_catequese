'use server';
import authService from "@/services/internal/AuthService";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    // 1. O seu authService chama o Fastify e retorna o TOKEN (string)
    const token = await authService(email, password);

    // 2. Salva O TOKEN dentro do cookie
    const cookieStore = await cookies();
    cookieStore.set("session_token", token, { // Mudamos o nome para 'session_token'
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24, // 1 dia
    });
  } catch (error) {
    // 3. Retorna o erro formatado para a tela caso o login falhe no Fastify
    return { error: (error as Error).message };
  }
  console.log("Login realizado com sucesso, token salvo no cookie.");
  // 4. Redireciona a tela após salvar o cookie
  redirect("/dashboard");
}
