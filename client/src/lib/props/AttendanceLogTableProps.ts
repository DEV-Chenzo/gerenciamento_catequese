import IStudentsLog from "@/lib/interfaces/IStudentsLog";
export default interface AttendanceLogTableProps {
  studentsLog: IStudentsLog[];
  attendance: Record<string, "P" | "F">;
  onAttendanceChange: (studentId: string, status: "P" | "F") => void;
}
