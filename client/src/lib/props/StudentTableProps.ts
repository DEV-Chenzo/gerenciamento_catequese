import type IStudents from "@/lib/interfaces/IStudents";
export default interface StudentTableProps {
  students: IStudents[];
  registerStudent: (students: IStudents[]) => void;
  deleteStudent: (students: IStudents[]) => void;
}
