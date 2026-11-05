export default interface InformationMenuProps {
  onSaveAndFinish: () => void;
  allStudentsPresent: () => void;
  allStudentsAbsent: () => void;
  clearAllStudents: () => void;
  enrolledCount: number;
  presentCount: number;
  absentCount: number;
  markedCount: number;
}
