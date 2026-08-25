import Fastify from "fastify";
import { studentRoutes } from "./presentation/routers/studentsRouters";
import {attendanceRoutes} from "./presentation/routers/attendanceRouter";
const App = Fastify({
  logger: true,
});

App.register(studentRoutes, { prefix: "/api" });
App.register(attendanceRoutes, { prefix: "/api" });

try {
  await App.listen({ port: 5000 });
} catch (err) {
  App.log.error(err);
  process.exit(1);
}
