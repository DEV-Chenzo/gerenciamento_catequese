import { Student } from "@/components/registration/InsertForm";

interface StudentTableProps {
  students: Student[];
}

export default function StudentTable({ students }: StudentTableProps) {
  return (
    <section className="w-200 my-6 p-6 rounded-lg bg-surface-container-lowest font-sans flex flex-col">
      <h3 className="text-xl font-medium mb-4 text-primary">Lista de Alunos</h3>

      {/* Tabela de Cabeçalho Fixa */}
      <table className="w-full text-left table-fixed">
        <thead>
          <tr className="border-b border-surface-container-high text-on-surface-variant">
            <th className="w-3/4 py-2 px-3">Nome</th>
            <th className="w-1/4 py-2 px-3">Ano da Turma</th>
          </tr>
        </thead>
      </table>

      {/* Container com Scroll apenas para a Lista / tbody */}
      <div className="max-h-60 overflow-y-auto pr-1 my-1">
        <table className="w-full text-left table-fixed border-separate border-spacing-y-4">
          <tbody className="text-on-surface-variant">
            {students.length === 0 ? (
              <tr>
                <td
                  colSpan={2}
                  className="py-4 text-center text-on-surface-variant"
                >
                  Nenhum aluno cadastrado.
                </td>
              </tr>
            ) : (
              students.map((student) => (
                <tr key={student.id} >
                  <td className="w-3/4 py-2 px-3 rounded-l-md bg-surface-container-low">
                    {student.name}
                  </td>
                  <td className="w-1/4 py-2 px-3 rounded-r-md border-l-2 border-surface-container-lowest bg-surface-container-low">
                    {student.classYear === "CURRENT"
                      ? "Ano Atual"
                      : "Próximo Ano"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <button className="mt-4 w-full py-2 px-3 bg-primary text-on-primary rounded-md hover:bg-primary-hover cursor-pointer">
        Cadastrar Aluno
      </button>
    </section>
  );
}
