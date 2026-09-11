import { FastifyInstance } from 'fastify'
import { authController } from '../controllers/AuthController'
 
export async function authRoutes(app: FastifyInstance) {
  app.post('/login', authController.login.bind(authController))
}