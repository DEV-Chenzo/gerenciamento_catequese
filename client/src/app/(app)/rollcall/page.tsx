"use client";
import { useState, useEffect, useRef } from "react";
import { createAttendance } from "@/services/internal/AttendanceService";
import { getStudents } from "@/services/internal/StudentsService";
import IStudentLog from "@/lib/interfaces/IStudentsLog";
import StudentsLogTableFilter from "@/components/rollcall/StudentsLogTableFilter";
import AttendanceLogTable from "@/components/rollcall/AttendanceLogTable";
import FeedbackModal from "@/components/rollcall/FeedbackModal";
import InformationMenu from "@/components/rollcall/InformationMenu";


export default function RollCallPage() {
  // TODO: Lógica para buscar os registros de presença do servidor
  const [students, setStudents] = useState<IStudentLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [orderValue, setOrderValue] = useState<"asc" | "desc" | "none">("none");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | "none">(
    "none",
  );
  const [nameFilter, setNameFilter] = useState("");
  const [selectedClassYear, setSelectedClassYear] = useState<
    "CURRENT" | "NEXT" | null
  >(null);
  const [attendance, setAttendance] = useState<Record<string, "P" | "F">>({});
  const bulkAttendanceSnapshot = useRef<{
    status: "P" | "F";
    previous: Record<string, "P" | "F" | undefined>;
  } | null>(null);
  const [saveMessage, setSaveMessage] = useState("");
  const [ saveErrorMessage, setSaveErrorMessage] = useState("");

  const handleAttendanceChange = (studentId: string, status: "P" | "F") => {
    bulkAttendanceSnapshot.current = null;
    setAttendance((current) => {
      if (current[studentId] === status) {
        const updated = { ...current };
        delete updated[studentId];
        return updated;
      }
      return { ...current, [studentId]: status };
    });
  };

  const markFilteredStudents = (status: "P" | "F") => {
    const snapshot = bulkAttendanceSnapshot.current;

    if (snapshot?.status === status) {
      setAttendance((current) => {
        const restored = { ...current };
        Object.entries(snapshot.previous).forEach(([studentId, previousStatus]) => {
          if (previousStatus === undefined) {
            delete restored[studentId];
          } else {
            restored[studentId] = previousStatus;
          }
        });
        return restored;
      });
      bulkAttendanceSnapshot.current = null;
      return;
    }

    const previous: Record<string, "P" | "F" | undefined> = {};
    filteredStudents.forEach((student) => {
      previous[student.id] = attendance[student.id];
    });
    bulkAttendanceSnapshot.current = { status, previous };

    setAttendance((current) => {
      const updated = { ...current };
      filteredStudents.forEach((student) => {
        updated[student.id] = status;
      });
      return updated;
    });
  };

  const clearFilteredAttendance = () => {
    bulkAttendanceSnapshot.current = null;
    setAttendance((current) => {
      const updated = { ...current };
      filteredStudents.forEach((student) => {
        delete updated[student.id];
      });
      return updated;
    });
  };

  const onSaveAndFinish = async () => {
    const recordsByClassYear = (
      selectedClassYear ? [selectedClassYear] : (["CURRENT", "NEXT"] as const)
    )
      .map((classYear) => ({
        classYear,
        records: filteredStudents
          .filter(
            (student) =>
              student.classYear === classYear && attendance[student.id],
          )
          .map((student) => ({
            studentId: student.id,
            present: attendance[student.id] === "P",
          })),
      }))
      .filter(({ records }) => records.length > 0);

    if (recordsByClassYear.length === 0) {
      setSaveMessage(
        "Marque a presença ou ausência de pelo menos um estudante.",
      );
      return;
    }

    try {
      const date = new Date().toISOString();
      await Promise.all(
        recordsByClassYear.map(({ classYear, records }) =>
          createAttendance({ date, classYear, records }),
        ),
      );
      setSaveMessage("Chamada salva com sucesso.");
    } catch (error) {
      setSaveErrorMessage(
        error instanceof Error ? error.message : "Erro ao salvar a chamada.",
      );
    }
  };

  useEffect(() => {
    async function fetchStudentsFromApi() {
      try {
        const data = await getStudents();
        setStudents(data);
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

  const { present: presentCount, absent: absentCount } = Object.values(attendance).reduce(
    (counts, status) => {
      if (status === "P") counts.present += 1;
      else if (status === "F") counts.absent += 1;
      return counts;
    },
    { present: 0, absent: 0 },
  );
  const markedCount = presentCount + absentCount;

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
      <div className="flex justify-center items-center w-full h-80 p-6 bg-red-50 text-red-600 rounded-md shadow">
        <p className="text-md font-inter font-bold">{errorMessage}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-4">
      <InformationMenu
        enrolledCount={students.length}
        presentCount={presentCount}
        absentCount={absentCount}
        markedCount={markedCount}
        onSaveAndFinish={onSaveAndFinish}
        allStudentsPresent={() => markFilteredStudents("P")}
        allStudentsAbsent={() => markFilteredStudents("F")}
        clearAllStudents={clearFilteredAttendance}
      />
      {saveMessage && (
        <FeedbackModal
          message={saveMessage}
          onClose={() => setSaveMessage("")}
        />
      )}
      {saveErrorMessage && (
        <FeedbackModal
          message={saveErrorMessage}
          onClose={() => setSaveErrorMessage("")}
          borderColor="border-error"
          textColor="text-error"
          bgColor="bg-status-absent"
          bgColorHover="bg-status-absent-hover"
        />
      )}
      <StudentsLogTableFilter
        orderValue={orderValue}
        inAlphabeticalOrder={handleAlphabeticalOrderToggle}
        nameFilter={nameFilter}
        onFilterChange={setNameFilter}
        selectedClassYear={selectedClassYear}
        onClassYearChange={handleClassYearChange}
        onClearFilters={handleClearFilters}
      />
      <AttendanceLogTable
        studentsLog={filteredStudents}
        attendance={attendance}
        onAttendanceChange={handleAttendanceChange}
      />
    </div>
  );
}
