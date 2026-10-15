export default async function authService(email: string, password: string) {
    const response = await fetch(`${process.env.API_INTERNAL_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Falha ao realizar login no servidor');
  }
  const data = await response.json();
  return data.token;
}   

// Teste para verificar a função authService diretamente no arquivo AuthService.ts
// ------------------------------------------------------------------
// (async () => {
//   try {
//     const token = await authService("admin@catequese.com", "SenhaSegura123");
//     console.log("Token recebido com sucesso:", token);
//   } catch (error) {
//     console.error("Erro no teste:", (error as Error).message);
//   }
// })();