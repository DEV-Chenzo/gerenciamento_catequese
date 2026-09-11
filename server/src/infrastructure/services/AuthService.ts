import { prisma } from '../database/lib/prisma'
import bcrypt from 'bcrypt'

class AuthService {
  async validateUser(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return null

    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) return null

    return { id: user.id, email: user.email, name: user.name }
  }
}

export const authService = new AuthService()
