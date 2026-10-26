"use client";
import { useState, useEffect } from "react";
import { getStudents } from "@/services/internal/StudentsService";
import IStudentLog from "@/lib/interfaces/IStudentsLog";
import StudentsLogTableFilter from "@/components/rollcall/StudentsLogTableFilter";
import AttendanceLogTable from "@/components/rollcall/AttendanceLogTable";

export default function RollCallPage() {
  // Lógica para buscar os registros de presença do servidor
  const [students, setStudents] = useState<IStudentLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [orderValue, setOrderValue] = useState<"asc" | "desc" | "none">("none");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | "none">(
    "none",
  );
  const [nameFilter, setNameFilter] = useState("");
  const [selectedClassYear, setSelectedClassYear] = useState<"CURRENT" | "NEXT" | null>(null);

  useEffect(() => {
    async function fetchStudentsFromApi() {
      try {
        const data = await getStudents(); // ou sua rota do backend
        setStudents(data); // Atualiza o estado com os dados da API
      } catch (err) {
        setErrorMessage(
          err instanceof Error ? err.message : "Erro desconhecido",
        );
      } finally {
        setLoading(false); // Finaliza o estado de carregamento
      }
    }

    fetchStudentsFromApi();
  }, []);
  
  const handleAlphabeticalOrderToggle = () => {
    const sortedStudents = [...students];

    if (sortDirection === "none" || sortDirection === "desc") {
      // Ordena de A a Z (Crescente)
      sortedStudents.sort((a, b) =>
        a.name.localeCompare(b.name, "pt-BR", { sensitivity: "accent" }),
      );
      setSortDirection("asc");
      setOrderValue("asc");
    } else {
      // Ordena de Z a A (Decrescente)
      sortedStudents.sort((a, b) =>
        b.name.localeCompare(a.name, "pt-BR", { sensitivity: "accent" }),
      );
      setSortDirection("desc");
      setOrderValue("desc");
    }

    setStudents(sortedStudents);
  };

  const filteredStudents = students.filter((student) => {
    const matchesName = student.name
      .trimStart()
      .toLocaleLowerCase("pt-BR")
      .startsWith(nameFilter.trim().toLocaleLowerCase("pt-BR"));
    const matchesClassYear =
      selectedClassYear === null || student.classYear === selectedClassYear;

    return matchesName && matchesClassYear;
  });

  const handleClassYearChange = (classYear: "CURRENT" | "NEXT") => {
    setSelectedClassYear((current) =>
      current === classYear ? null : classYear,
    );
  };

  const handleClearFilters = () => {
    setNameFilter("");
    setSelectedClassYear(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-6 rounded-md">
        <p className="text-gray-500 animate-pulse">Carregando estudantes...</p>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="p-6 bg-red-50 text-red-600 rounded-md shadow">
        <p>{errorMessage}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-4">
      <StudentsLogTableFilter
        orderValue={orderValue}
        inAlphabeticalOrder={handleAlphabeticalOrderToggle}
        nameFilter={nameFilter}
        onFilterChange={setNameFilter}
        selectedClassYear={selectedClassYear}
        onClassYearChange={handleClassYearChange}
        onClearFilters={handleClearFilters}
      />
      <AttendanceLogTable studentsLog={filteredStudents} />
    </div>
  );
}
