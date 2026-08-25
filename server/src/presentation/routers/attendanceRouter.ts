import { FastifyInstance } from "fastify";
import { attendanceController } from "../controllers/AttendanceController";

export async function attendanceRoutes(app: FastifyInstance) {
    app.get("/attendance", attendanceController.getRecord);
    app.get("/summary", attendanceController.getSummary);
    app.post("/attendance", attendanceController.createBulkAttendance);   
}