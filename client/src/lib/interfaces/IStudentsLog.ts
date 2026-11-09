export default interface IStudentsLog {
  id: string;
  name: string;
  phone: string;
  baptism: boolean;
  firstCommunion: boolean;
  classYear: string;
  summary?: {
    select: {
      totalPresents: number;
      totalAbsences: number;
    };
  };
}
