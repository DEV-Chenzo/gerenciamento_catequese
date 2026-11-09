export default interface IStudents {
  id: string;
  name: string;
  phone: string;
  baptism: boolean;
  firstCommunion: boolean;
  classYear: "CURRENT" | "NEXT";
}