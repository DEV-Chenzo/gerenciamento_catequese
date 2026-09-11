import { FastifyReply, FastifyRequest } from 'fastify'
import { authService } from '../../infrastructure/services/AuthService'

class AuthController {
  async login(request: FastifyRequest, reply: FastifyReply) {
    const { email, password } = request.body as any

    const user = await authService.validateUser(email, password)
    if (!user) {
      return reply.status(401).send({ message: 'Credenciais inválidas' })
    }

    const token = await reply.jwtSign(
      { name: user.name },
      { sign: { sub: user.id, expiresIn: '7d' } }
    )

    return reply.status(200).send({ token })
  }
}

export const authController = new AuthController()