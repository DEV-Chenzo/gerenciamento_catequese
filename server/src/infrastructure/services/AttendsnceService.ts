// Ajuste o caminho da importação
import RegistrarChamadaEmLoteInput from "../../domain/entities/RegisterBatchCall";
import { prisma } from "../database/lib/prisma";
class AttendanceService {
  async registerBulkAttendance(data: RegistrarChamadaEmLoteInput) {
    const dataChamada = new Date(data.date);

    // Usa transação para garantir que se um falhar, nada seja salvo incorretamente
    const operacoes = data.records.map((record) => {
      // 1. Cria ou atualiza o registro diário do aluno
      const upsertRecord = prisma.attendanceRecord.upsert({
        where: {
          studentId_date: {
            studentId: record.studentId,
            date: dataChamada,
          },
        },
        update: {
          present: record.present,
          classYear: data.classYear,
        },
        create: {
          studentId: record.studentId,
          date: dataChamada,
          present: record.present,
          classYear: data.classYear,
        },
      });

      // 2. Atualiza os contadores acumulados no AttendanceSummary
      const upsertSummary = prisma.attendanceSummary.upsert({
        where: {
          studentId: record.studentId,
        },
        update: {
          totalPresents: record.present ? { increment: 1 } : undefined,
          totalAbsences: !record.present ? { increment: 1 } : undefined,
        },
        create: {
          studentId: record.studentId,
          totalPresents: record.present ? 1 : 0,
          totalAbsences: !record.present ? 1 : 0,
        },
      });

      return [upsertRecord, upsertSummary];
    });

    // Achata o array de operações e executa todas de forma atômica
    const resultado = await prisma.$transaction(operacoes.flat());

    return {
      message: "Chamada registrada com sucesso",
      totalProcessado: data.records.length,
    };
  }
}

export const attendanceService = new AttendanceService();
