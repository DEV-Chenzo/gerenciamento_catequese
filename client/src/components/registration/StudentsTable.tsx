"use client";

import { useState } from "react";
import StudentTableProps from "@/lib/props/StudentTableProps";
import { TiDelete } from "react-icons/ti";
import { FaCheck } from "react-icons/fa6";

export default function StudentTable({
  students,
  registerStudent,
  deleteStudent,
}: StudentTableProps) {
  // Estado para armazenar os IDs dos alunos selecionados
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // 1. Marcar ou desmarcar um único aluno
  const toggleStudentSelection = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  // 2. Marcar ou desmarcar todos os alunos de uma vez
  const toggleSelectAll = () => {
    if (selectedIds.length === students.length) {
      setSelectedIds([]); // Desmarca todos
    } else {
      setSelectedIds(students.map((student) => student.id)); // Marca todos
    }
  };

  // 3. Deletar apenas os alunos que estão selecionados nos checkboxes
  const handleBatchDelete = () => {
    const selectedStudents = students.filter((student) =>
      selectedIds.includes(student.id),
    );
    deleteStudent(selectedStudents);
    setSelectedIds([]); // Limpa a seleção após excluir
  };

  // 4. Deletar um único aluno via ícone
  const deletedSubmit = (id: string) => {
    const student = students.filter((s) => s.id === id);
    deleteStudent(student);
    setSelectedIds((prev) => prev.filter((item) => item !== id));
  };

  const registerSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    registerStudent(students);
  };

  const isAllSelected =
    students.length > 0 && selectedIds.length === students.length;

  return (
    <section className="w-200 my-6 p-6 rounded-lg bg-surface-container-lowest shadow-[0_2px_4px_rgba(0,0,0,0.1)] font-sans flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-medium text-primary">Lista de Alunos</h3>

        {/* Botão de Excluir Selecionados só aparece quando há itens marcados */}
        {selectedIds.length > 0 && (
          <button
            onClick={handleBatchDelete}
            className="text-sm px-3 py-1 border-3 border-red-400 text-red-400 font-bold rounded-md hover:text-white hover:bg-red-600 hover:border-red-600 transition-colors cursor-pointer"
          >
            Excluir Selecionados ({selectedIds.length})
          </button>
        )}
      </div>

      {/* Tabela de Cabeçalho Fixa */}
      <table className="w-full text-left table-fixed">
        <thead>
          <tr className="border-b border-surface-container-high text-on-surface-variant">
            <th className="w-7/12 py-2 px-3">Nome</th>
            <th className="w-3/12 py-2 px-3">Ano da Turma</th>
            <th className="w-2/12 py-2 px-3 text-sm text-left flex items-center">
              <span className="mr-3">Selecionar todos</span>
              <label className="relative flex items-center justify-center cursor-pointer">
                {/* Input nativo escondido, apenas para acessibilidade e estado */}
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={toggleSelectAll}
                  className="sr-only" // Esconde o input nativo
                />

                {/* Caixa visual do Checkbox */}
                <div
                  className={`w-5 h-5 border-2 rounded-xs flex items-center justify-center font-bold text-white transition-all select-none ${
                    isAllSelected
                      ? "bg-slate-400 border-slate-400"
                      : "border-surface-container-high bg-transparent"
                  }`}
                >
                  {isAllSelected && (
                    <span className="text-sm leading-none">-</span>
                  )}
                </div>
              </label>
            </th>
          </tr>
        </thead>
      </table>

      {/* Container com Scroll para a Lista */}
      <div className="max-h-60 overflow-y-auto pr-1 my-1">
        {students.length === 0 ? (
          <table className="w-full text-left table-fixed border-separate border-spacing-y-1">
            <tbody className="text-on-surface-variant">
              <tr>
                <td
                  colSpan={3}
                  className="py-4 text-center text-on-surface-variant"
                >
                  Nenhum aluno inserido.
                </td>
              </tr>
            </tbody>
          </table>
        ) : (
          <table className="w-full text-left table-fixed border-separate border-spacing-y-2">
            <tbody className="text-on-surface-variant">
              {students.map((student) => {
                const isChecked = selectedIds.includes(student.id);

                return (
                  <tr key={student.id}>
                    <td className="w-7/12 py-2 px-3 rounded-l-md bg-surface-container-low shadow-[0_1px_2px_rgba(0,0,0,0.05)] border-l-2 border-surface-container-lowest">
                      {student.name}
                    </td>
                    <td className="w-3/12 py-2 px-3 bg-surface-container-low shadow-[0_1px_2px_rgba(0,0,0,0.05)] border-l-2 border-surface-container-lowest">
                      {student.classYear === "CURRENT"
                        ? "Ano Atual"
                        : "Próximo Ano"}
                    </td>
                    <td className="w-2/12 py-2 px-3 rounded-r-md bg-surface-container-low text-right shadow-[1px_1px_2px_rgba(0,0,0,0.05)] border-l-2 border-surface-container-lowest">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          onClick={() => deletedSubmit(student.id)}
                          className="flex items-center justify-center text-surface-container-highest hover:text-red-500 transition-colors"
                          title="Excluir aluno"
                        >
                          <TiDelete className="text-2xl cursor-pointer" />
                        </button>
                        <label className="relative flex items-center justify-center cursor-pointer">
                          {/* Input nativo escondido, apenas para acessibilidade e estado */}
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleStudentSelection(student.id)}
                            className="sr-only" // Esconde o input nativo
                          />

                          {/* Caixa visual do Checkbox */}
                          <div
                            className={`w-5 h-5 p-2 border-2 rounded-xs flex items-center justify-center font-bold text-white transition-all select-none ${
                              isChecked
                                ? "bg-primary border-primary"
                                : "border-surface-container-high bg-transparent"
                            }`}
                          >
                            {isChecked && (
                              <span className="text-sm leading-none">
                                <FaCheck />
                              </span>
                            )}
                          </div>
                        </label>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <button
        onClick={registerSubmit}
        className="mt-4 w-full py-2 px-3 bg-primary text-on-primary rounded-md hover:bg-primary-hover cursor-pointer"
      >
        Cadastrar Aluno
      </button>
    </section>
  );
}
