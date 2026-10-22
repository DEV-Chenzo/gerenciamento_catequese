import type IStudents from "@/lib/interfaces/IStudents";
export default interface InsertFormComponentProps {
  onAddStudent: (student: Omit<IStudents, "id">) => void;
}
