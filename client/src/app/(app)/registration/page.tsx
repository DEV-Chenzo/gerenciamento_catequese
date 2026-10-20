"use client"
import { useState } from "react";
import { createStudent } from "@/services/internal/StudentsService";
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
    console.log("Alunos para cadastros:", students);
    setStudents([]);  // Limpa a lista de alunos após o cadastro
    createStudent(students) // Chama a função para enviar os dados para o backend
      .then((response) => {
        console.log("Alunos cadastrados com sucesso:", response);
      })
      .catch((error) => {
        console.error("Erro ao cadastrar alunos:", error);
      }); 
  }

 const handleDeleteStudent = (studentToDelete: Student[]) => {
  // Cria um Set com os IDs dos alunos a serem removidos para busca em O(1)
  const idsToDelete = new Set(studentToDelete.map((s) => s.id));

  setStudents((prevStudents) =>
    prevStudents.filter((student) => !idsToDelete.has(student.id))
  );
};
  return (
    <div className="flex flex-col items-center justify-center h-full">
        <InsertFormComponent onAddStudent={handleAddStudent} />
        <StudentTablet students={students} registerStudent={handleCreateStudent} deleteStudent={handleDeleteStudent} />
    </div>
  );
}
