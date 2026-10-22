"use server";
import IStudent from "@/lib/interfaces/IStudents";

export async function createStudent(
  studentData: IStudent[],
): Promise<{ message: string; totalCriado: number }> {
  const baseUrl = process.env.API_INTERNAL_URL;
  const targetUrl = `${baseUrl}/students`;

  const response = await fetch(targetUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ list: studentData }),
  });

  // Lê como texto primeiro para inspecionar se veio HTML ou JSON
  const responseText = await response.text();

  if (!response.ok) {
    throw new Error(`Erro na API (${response.status}): ${responseText}`);
  }

  try {
    return JSON.parse(responseText);
  } catch (err) {
    throw new Error(
      `A API retornou HTML em vez de JSON na URL "${targetUrl}". Resposta recebida: ${responseText.substring(0, 100)}... erro: ${err}`,
    );
  }
}

export async function getStudents(): Promise<IStudent[]> {
  const baseUrl = process.env.API_INTERNAL_URL;
  const targetUrl = `${baseUrl}/students`;

  const response = await fetch(targetUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const responseText = await response.text();

  if (!response.ok) {
    throw new Error(`Erro na API (${response.status}): ${responseText}`);
  }

  try {
    return JSON.parse(responseText);
  } catch (err) {
    throw new Error(
      `A API retornou algo diferente em vez de JSON na URL "${targetUrl}". Resposta recebida: ${responseText.substring(0, 100)}... erro: ${err}`,
    );
  }
}
