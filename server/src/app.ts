import Fastify from "fastify";
import jwt from "@fastify/jwt";
import cors from "@fastify/cors";
import { PrefixApi } from "./utils/prefix";
import { authRoutes } from "./presentation/routers/authRouter";
import { studentRoutes } from "./presentation/routers/studentsRouters";
import { attendanceRoutes } from "./presentation/routers/attendanceRouter";

export const App = Fastify({
  logger: true,
});
if (!process.env.JWT_SECRET) {
  throw new Error("A variável de ambiente JWT_SECRET não está definida!");
}
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
App.register(cors, {
  // Permite a URL vinda da variável de ambiente
  origin: [frontendUrl, "http://localhost:3000"],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
});
App.register(jwt, {
  secret: process.env.JWT_SECRET,
});
App.register(authRoutes, { prefix: PrefixApi });
App.register(studentRoutes, { prefix: PrefixApi });
App.register(attendanceRoutes, { prefix: PrefixApi });

if (process.env.NODE_ENV !== "test") {
  try {
    await App.listen({ port: 5000, host: "0.0.0.0" });
  } catch (err) {
    App.log.error(err);
    process.exit(1);
  }
}
