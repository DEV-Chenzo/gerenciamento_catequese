"use client"
import { useState } from "react";
import InsertFormComponent, {Student} from "@/components/registration/InsertForm";
import StudentTablet from "@/components/registration/StudentsTable";

export default function RegistrationPage() {
  const [students, setStudents] = useState<Student[]>([]);

  // Função para adicionar um novo aluno na lista
  const handleAddStudent = (newStudentData: Omit<Student, "id">) => {
    const newStudent: Student = {
      ...newStudentData,
      id: crypto.randomUUID(), // Gera um ID único
    };

    setStudents((prevStudents) => [...prevStudents, newStudent]);
  };

  const handleCreateStudent = (students: Student[]) => {
    console.log("Alunos cadastrados:", students);
    setStudents([]); // Limpa a lista de alunos após o cadastro
  }

  const handleDeleteStudent = (studentToDelete: Student[]) => {
    setStudents((prevStudents) =>
      prevStudents.filter((student) => !studentToDelete.some(s => s.id === student.id))
    );
  }
  return (
    <div className="flex flex-col items-center justify-center h-full">
        <InsertFormComponent onAddStudent={handleAddStudent} />
        <StudentTablet students={students} registerStudent={handleCreateStudent} deleteStudent={handleDeleteStudent} />
    </div>
  );
}
