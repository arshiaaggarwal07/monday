// backend/src/services/auth.service.ts

import bcrypt from 'bcryptjs'
import prisma from '../utils/prisma'
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt'

export interface RegisterInput {
  name: string
  email: string
  password: string
}

export interface LoginInput {
  email: string
  password: string
}

export interface AuthResult {
  user: {
    id: string
    name: string
    email: string
  }
  accessToken: string
  refreshToken: string
}

export async function registerUser(input: RegisterInput): Promise<AuthResult> {
  // 1. Check if email already taken
  const existing = await prisma.user.findUnique({
    where: { email: input.email }
  })

  if (existing) {
    throw new Error('EMAIL_TAKEN')
  }

  // 2. Hash the password — never store plain text
  // 12 = "cost factor" — how much CPU work to hash. Higher = slower = harder to brute force.
  const passwordHash = await bcrypt.hash(input.password, 12)

  // 3. Create user in database
  const user = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      passwordHash,
    },
    select: {
      id: true,
      name: true,
      email: true,
    }
  })

  // 4. Generate tokens
  const payload = { userId: user.id, email: user.email }
  const accessToken  = signAccessToken(payload)
  const refreshToken = signRefreshToken(payload)

  return { user, accessToken, refreshToken }
}

export async function loginUser(input: LoginInput): Promise<AuthResult> {
  // 1. Find user
  const user = await prisma.user.findUnique({
    where: { email: input.email }
  })

  if (!user) {
    // Intentionally vague — don't reveal whether email exists
    throw new Error('INVALID_CREDENTIALS')
  }

  // 2. Compare password against stored hash
  const valid = await bcrypt.compare(input.password, user.passwordHash)

  if (!valid) {
    throw new Error('INVALID_CREDENTIALS')
  }

  // 3. Generate tokens
  const payload = { userId: user.id, email: user.email }
  const accessToken  = signAccessToken(payload)
  const refreshToken = signRefreshToken(payload)

  return {
    user: { id: user.id, name: user.name, email: user.email },
    accessToken,
    refreshToken,
  }
}

export async function refreshAccessToken(token: string): Promise<string> {
  const payload = verifyRefreshToken(token)

  // Verify user still exists in DB
  const user = await prisma.user.findUnique({
    where: { id: payload.userId }
  })

  if (!user) throw new Error('USER_NOT_FOUND')

  return signAccessToken({ userId: user.id, email: user.email })
}