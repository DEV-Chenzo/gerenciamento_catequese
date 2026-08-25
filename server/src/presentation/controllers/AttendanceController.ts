import { FastifyRequest, FastifyReply } from "fastify";
import { ClassYear } from "../../infrastructure/database/prisma/generated/prisma/client";
import { attendanceService } from "../../infrastructure/services/AttendanceService";

class AttendanceController {
  async getRecord(request: FastifyRequest, reply: FastifyReply) {
    const data = request.query as { id: string; date?: Date };
    const record = await attendanceService.getAttendanceRecord(
      data.id,
      data.date,
    );
    if (!record || record.length === 0) {
      return reply
        .status(404)
        .send({ message: "Registro de presença não encontrado" });
    }
    return reply.status(200).send(record);
  }
  async createBulkAttendance(request: FastifyRequest, reply: FastifyReply) {
    const data = request.body as {
      date: string;
      classYear: ClassYear;
      records: { studentId: string; present: boolean }[];
    };
    const result = await attendanceService.registerBulkAttendance(data);
    if (!result || Object.keys(result).length === 0) {
      return reply
        .status(400)
        .send({ message: "Falha ao registrar a chamada em lote" });
    }
    return reply.status(200).send(result);
  }
  async getSummary(request: FastifyRequest, reply: FastifyReply) {
    const data = request.query as { recordsId: string[] };
    const summary = await attendanceService.getAttendanceSummary(
      data.recordsId,
    );
    if (!summary || summary.length === 0) {
      return reply
        .status(404)
        .send({ message: "Resumo de presença não encontrado" });
    }
    return reply.status(200).send(summary);
  }
}

export const attendanceController = new AttendanceController();
