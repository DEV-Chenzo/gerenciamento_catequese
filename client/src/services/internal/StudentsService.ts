"use server";
import { Student } from "@/components/registration/InsertForm";

export async function createStudent(studentData: Student[]): Promise<Student[]> {
  const response = await fetch(`${process.env.API_INTERNAL_URL}/students`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(studentData)
  });

  if (!response.ok) {
    throw new Error("Failed to create student");
  }

  return response.json();
}