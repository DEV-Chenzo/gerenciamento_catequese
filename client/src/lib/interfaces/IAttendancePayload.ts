export default interface AttendancePayload {
  date: string;
  classYear: "CURRENT" | "NEXT";
  records: { studentId: string; present: boolean }[];
}