import { prisma } from "../database/lib/prisma";
import { StudentsList } from "../../domain/entities/StudentList";

export default class StudentServices {
  async createStudents(data: StudentsList) {
    const students = await prisma.student.createMany({
      data: data.list.map((student) => ({
        name: student.name,
        classYear: student.classYear,
      })),
    });
    return {
      message: "Alunos criados com sucesso",
      totalCriado: students.count,
    };
  }
  async getStudents() {
    const students = await prisma.student.findMany({
      select: {
        id: true,
        name: true,
        phone: true,
        baptism: true,
        firstCommunion: true,
        classYear: true,
        summary: {
          select: {
            totalPresents: true,
            totalAbsences: true,
          },
        },
      },
    });
    return students;
  }
  async getStudentsByName(name: string) {
    const students = await prisma.student.findMany({
      where: {
        name: {
          contains: name,
          mode: "insensitive",
        },
      },
      select: {
        id: true,
        name: true,
        phone: true,
        baptism: true,
        firstCommunion: true,
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
    return students;
  }
  async getStudentIdByName(name: string): Promise<string | null> {
    const student = await prisma.student.findFirst({
      where: {
        name: {
          equals: name,
          mode: "insensitive", // Ignora maiúsculas e minúsculas
        },
      },
      select: {
        id: true, // Seleciona apenas o campo 'id' no banco
      },
    });
    // Retorna a string do id ou null se não encontrar
    return student ? student.id : null;
  }
  async updateStudents(data: StudentsList) {
    const updatePromises = data.list.map((student) =>
      prisma.student.update({
        where: { id: student.id },
        data: {
          name: student.name,
          phone: student.phone,
          baptism: student.baptism,
          firstCommunion: student.firstCommunion,
          classYear: student.classYear,
        },
      })
    );
    return Promise.all(updatePromises);
  }

  async deleteStudents(data: StudentsList) {
    const studentsNames = data.list.map((student) => student.name);

    const deletedStudents = await prisma.student.deleteMany({
      where: {
        name: {
          in: studentsNames,
        },
      },
    });
    return {
      message: "Alunos deletados com sucesso",
      totalDeletado: deletedStudents.count,
    };
  }
}

export const studentServices = new StudentServices();
