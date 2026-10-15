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
  return (
    <div className="flex flex-col items-center justify-center h-full">
        <InsertFormComponent onAddStudent={handleAddStudent} />
        <StudentTablet students={students} />
    </div>
  );
}
