import { useState } from "react";
import AttendanceLogTableProps from "@/lib/props/AttendanceLogTableProps";

export default function AttendanceLogTable({
  studentsLog,
}: AttendanceLogTableProps) {
  const [active, setActive] = useState<Record<string, "P" | "F">>({});

  const onAttendanceChange = (studentId: string, status: "P" | "F") => {
    setActive((prev) => {
      // Se o botão clicado já é o que está selecionado para esse aluno...
      if (prev[studentId] === status) {
        const copy = { ...prev };
        delete copy[studentId]; // Remove o registro, tornando o estado vazio (padrão)
        return copy;
      }
      // Caso contrário, define o novo status escolhido ("P" ou "F")
      return {
        ...prev,
        [studentId]: status,
      };
    });
  };
  return (
    <section className="w-200 flex flex-col rounded-xl bg-surface-container-lowest shadow-[0_2px_4px_rgba(0,0,0,0.1)] font-sans">
      {studentsLog.length > 0 ? (
        <section className="flex flex-col gap-2 w-full rounded-xl bg-surface-container-lowest">
          <div className="flex items-center  w-full mb-2 px-5 py-5 rounded-t-xl bg-surface-container-highest">
            <span className=" w-4/7 text-lg font-sans font-bold text-on-surface-variant ">
              Nome
            </span>
            <span className=" w-2/7 text-md font-sans font-bold text-on-surface-variant">
              Turma
            </span>
            <span className=" w-1/7 text-md font-sans font-bold text-on-surface-variant">
              Presença
            </span>
          </div>
          {studentsLog.map((student) => (
            <div key={student.id} className=" rounded-b-xl px-2">
              <div className="flex items-center px-3 py-2 mb-2 gap-2 bg-surface-container-low rounded-lg font-sans">
                <span className="w-4/7 ml-1.5 text-md font-medium  text-on-surface justify-self-center ">
                  {student.name}
                </span>
                <span className="w-2/7 text-md font-medium outline-l-2 outline-surface-container text-on-surface ml-2">
                  {student.classYear == "CURRENT" ? "Atual" : "Próxima"}
                </span>
                <div className="flex items-center w-1/7 ml-2">
                  <button
                    onClick={() => onAttendanceChange(student.id, "P")}
                    className={`px-2 py-1 w-8 rounded-l-md cursor-pointer transition-colors hover:backdrop-filter hover:brightness-80 hover:transition-color ${active[student.id] === "P" ? "bg-status-present text-status-present-bg" : "bg-surface-container-highest text-white"}`}
                  >
                    P
                  </button>
                  <button
                    onClick={() => onAttendanceChange(student.id, "F")}
                    className={`px-2 py-1 w-8 rounded-r-md cursor-pointer transition-colors hover:backdrop-filter hover:brightness-80 hover:transition-color ${active[student.id] === "F" ? "bg-status-absent text-status-absent-bg" : "bg-surface-container-highest text-white"}`}
                  >
                    F
                  </button>
                </div>
              </div>
            </div>
          ))}
        </section>
      ) : (
        <p className="text-center text-slate-500">Nenhum aluno encontrado.</p>
      )}
    </section>
  );
}
