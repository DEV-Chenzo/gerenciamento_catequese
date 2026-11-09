export interface Student {
  id: string;
  name: string;
  phone: string;
  baptism: boolean;
  firstCommunion: boolean;
  classYear: "CURRENT" | "NEXT";
}

export class StudentsList {
  constructor(readonly list: Array<Student>) {}
}
