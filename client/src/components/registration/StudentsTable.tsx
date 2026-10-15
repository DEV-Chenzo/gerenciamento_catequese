import { Student } from "@/components/registration/InsertForm";
import { TiDelete } from "react-icons/ti";
interface StudentTableProps {
  students: Student[];
  registerStudent: (students: Student[]) => void;
  deleteStudent: (students: Student[]) => void;
}

export default function StudentTable({
  students,
  registerStudent,
  deleteStudent
}: StudentTableProps) {
  const registerSubmit = (e: React.PointerEvent<HTMLButtonElement>) => {
    e.preventDefault();
    registerStudent(students);
  };

  const deletedSubmit = (id: string) => {
    const student = students.filter((student) => student.id === id);
    deleteStudent(student);
  }
  return (
    <section className="w-200 my-6 p-6 rounded-lg bg-surface-container-lowest font-sans flex flex-col">
      <h3 className="text-xl font-medium mb-4 text-primary">Lista de Alunos</h3>

      {/* Tabela de Cabeçalho Fixa */}
      <table className="w-full text-left table-fixed">
        <thead>
          <tr className="border-b border-surface-container-high text-on-surface-variant">
            <th className="w-8/12 py-2 px-3">Nome</th>
            <th className="w-3/12 py-2 px-3">Ano da Turma</th>
            <th className="w-1/12 py-2 px-3">Ações</th>
          </tr>
        </thead>
      </table>

      {/* Container com Scroll apenas para a Lista / tbody */}
      <div className="max-h-60 overflow-y-auto pr-1 my-1">
        {students.length === 0 ? (
          <table className="w-full text-left table-fixed border-separate border-spacing-y-1">
            <tbody className="text-on-surface-variant">
              <tr>
                <td
                  colSpan={2}
                  className="py-4 text-center text-on-surface-variant"
                >
                  Nenhum aluno inserido.
                </td>
              </tr>
            </tbody>
          </table>
        ) : (
          <table className="w-full text-left table-fixed border-separate border-spacing-y-4">
            <tbody className="text-on-surface-variant">
              {students.map((student) => (
                <tr key={student.id}>
                  <td className="w-8/12 py-2 px-3 rounded-l-md bg-surface-container-low">
                    {student.name}
                  </td>
                  <td className="w-3/12 py-2 px-3 rounded-r-md border-l-2 border-surface-container-lowest bg-surface-container-low">
                    {student.classYear === "CURRENT"
                      ? "Ano Atual"
                      : "Próximo Ano"}
                  </td>
                  <td className="w-1/12 py-2 px-3 mr-1 text-center rounded-r-md border-l-2 border-surface-container-lowest ">
                    <button onClick={() => deletedSubmit(student.id)} className="flex items-center justify-center">
                      <TiDelete className="text-3xl text-transparent cursor-pointer hover:text-red-400 hover:transition-discrete" />
                    </button>
                  </td>
                </tr>
              ))} 
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
