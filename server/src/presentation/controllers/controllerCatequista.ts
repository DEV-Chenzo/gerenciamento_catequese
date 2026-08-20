import { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../../infrastructure/database/lib/prisma';

async function getStudentsHandler(request: FastifyRequest,
  reply: FastifyReply) {
    const students = await prisma.student.findMany({
        select:{id:true, name:true, classYear:true, summary:true },
    });
    return reply.status(200).send(students);

}