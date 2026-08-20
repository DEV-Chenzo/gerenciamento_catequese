import { prisma } from "../database/lib/prisma";
import { StudentsList } from "../../domain/entities/StudentList";

export default class StudentServices {
  async createStudents(data: StudentsList) {
    const students = await prisma.student.createMany({
      data: data.list.map((name) => ({
        name,
      })) 
    });
    return students
  }
  async getStudent(name: string) {
    const student = await prisma.student.findMany({
      where: {
        name: {
          contains: name,
          mode: "insensitive",
        },
      },
      select: {
        id: true,
        name: true,
        classYear: true,
        summary: {
          select: {
            totalPresents: true,
            totalAbsences: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });
    return student;
  }
}
