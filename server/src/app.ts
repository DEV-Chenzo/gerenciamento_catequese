import Fastify from "fastify";

const App = Fastify({
  logger: true,
});

try {
  await App.listen({ port: 5000 });
} catch (err) {
  App.log.error(err);
  process.exit(1);
}
