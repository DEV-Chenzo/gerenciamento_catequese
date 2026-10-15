export interface Student {
  id: string;
  name: string;
  classYear: "CURRENT" | "NEXT";
}

export class StudentsList {
    constructor (
        readonly list: Array<Student>
    ) {}
}