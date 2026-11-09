"use client";

import { useState, useEffect } from "react";
import { getStudents } from "@/services/internal/StudentsService";
import IStudentLog from "@/lib/interfaces/IStudentsLog";

export default function StudentsPage() {
  const [totalStudents, setTotalStudents] = useState(0);
  const [baptizedStudents, setBaptizedStudents] = useState(0);
  const [averageAttendance, setAverageAttendance] = useState(0);
  const [students, setStudents] = useState<IStudentLog[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStudentsFromApi() {
      try {
        const data = await getStudents();
        setStudents(data);
        setTotalStudents(data.length);
        setBaptizedStudents(
          data.filter((student) => student.baptism === true).length,
        );
;
      } catch (err) {
        setErrorMessage(
          err instanceof Error ? err.message : "Erro desconhecido",
        );
      } finally {
        setLoading(false);
      }
    }

    fetchStudentsFromApi();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-6 rounded-md">
        <p className="text-gray-500 animate-pulse">Carregando estudantes...</p>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="flex justify-center items-center w-full h-80 p-6 bg-red-50 text-red-600 rounded-md shadow">
        <p className="text-md font-inter font-bold">{errorMessage}</p>
      </div>
    );
  }

  return (
    <section className="flex flex-col gap-6">
      <section className="flex gap-24 justify-between p-8">
        <div>
          <h1 className="text-5xl font-serif font-medium text-primary">
            Gestão de Alunos
          </h1>
          <p className="text-md text-on-surface ml-1">
            Acompanhamento dos jovens, histórico sacramental e contato fraterno
            com as famílias da comunidade.
          </p>
        </div>
        <section className="flex gap-16 items-center justify-center px-6 bg-surface-container-lowest rounded-xl">
          <div className="flex flex-col items-center gap-2 w-14 ">
            <h3 className="text-xs font-inter text-on-surface-variant text-center w-68">
              Total Geral
            </h3>
            <span className="text-2xl font-inter font-medium text-primary">
              {totalStudents}
            </span>
          </div>
          <div className="flex flex-col items-center gap-2 w-14 ">
            <h3 className="text-xs font-inter text-on-surface-variant text-center w-68 pr-2">
              Batizados
            </h3>
            <span className="text-2xl font-inter font-medium text-secondary">
              {baptizedStudents}/100
            </span>
          </div>
          <div className="flex flex-col items-center gap-2 w-14">
            <h3 className="text-xs font-inter text-on-surface-variant text-center w-68">
              Presença Média
            </h3>
            <span className="text-2xl font-inter font-medium text-status-present">
              {averageAttendance}%
            </span>
          </div>
        </section>
      </section>
      <section></section>
    </section>
  );
}
