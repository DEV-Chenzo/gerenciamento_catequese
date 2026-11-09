"use server";
import AttendancePayload from "@/lib/interfaces/IAttendancePayload";

export async function createAttendance(data: AttendancePayload) {
  const baseUrl = process.env.API_INTERNAL_URL;
  const targetUrl = `${baseUrl}/attendance`;
  const response = await fetch(targetUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Não foi possível salvar a chamada.");
  }

  return response.json();
}

export async function getAttendance() {
  const baseUrl = process.env.API_INTERNAL_URL;
  const targetUrl = `${baseUrl}/attendance`;
  const response = await fetch(targetUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Não foi possível obter o histórico de chamadas.");
  }
  console.log("Response:", response);
  return response.json();
}
