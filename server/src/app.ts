import Fastify from "fastify";
import jwt from "@fastify/jwt";
import { PrefixApi } from "./utils/prefix";
import { authRoutes } from "./presentation/routers/authRouter";
import { studentRoutes } from "./presentation/routers/studentsRouters";
import { attendanceRoutes } from "./presentation/routers/attendanceRouter";
const App = Fastify({
  logger: true,
});
if (!process.env.JWT_SECRET) {
  throw new Error("A variável de ambiente JWT_SECRET não está definida!");
}

App.register(jwt, {
  secret: process.env.JWT_SECRET,
});
App.register(authRoutes, { prefix: PrefixApi });
App.register(studentRoutes, { prefix: PrefixApi });
App.register(attendanceRoutes, { prefix: PrefixApi });

try {
  await App.listen({ port: 5000 });
} catch (err) {
  App.log.error(err);
  process.exit(1);
}
