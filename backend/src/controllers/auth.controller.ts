// backend/src/controllers/auth.controller.ts
import bcrypt from 'bcryptjs'
import { Request, Response } from 'express'
import * as AuthService from '../services/auth.service'
import prisma from '../utils/prisma'

const COOKIE_OPTIONS = {
  httpOnly: true,       // JS cannot read this cookie
  secure: process.env.NODE_ENV === 'production',  // HTTPS only in prod
  sameSite: 'strict' as const,  // CSRF protection
  maxAge: 7 * 24 * 60 * 60 * 1000,  // 7 days in ms
}

export async function register(req: Request, res: Response): Promise<void> {
  try {
    const { name, email, password } = req.body

    // Basic validation
    if (!name || !email || !password) {
      res.status(400).json({ error: 'Name, email, and password are required' })
      return
    }

    if (password.length < 8) {
      res.status(400).json({ error: 'Password must be at least 8 characters' })
      return
    }

    const result = await AuthService.registerUser({ name, email, password })

    // Set refresh token as httpOnly cookie
    res.cookie('refreshToken', result.refreshToken, COOKIE_OPTIONS)

    res.status(201).json({
      user: result.user,
      accessToken: result.accessToken,
    })
  } catch (err) {
    const error = err as Error
    if (error.message === 'EMAIL_TAKEN') {
      res.status(409).json({ error: 'An account with this email already exists' })
      return
    }
    console.error('Register error:', error)
    res.status(500).json({ error: 'Something went wrong' })
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' })
      return
    }

    const result = await AuthService.loginUser({ email, password })

    res.cookie('refreshToken', result.refreshToken, COOKIE_OPTIONS)

    res.status(200).json({
      user: result.user,
      accessToken: result.accessToken,
    })
  } catch (err) {
    const error = err as Error
    if (error.message === 'INVALID_CREDENTIALS') {
      res.status(401).json({ error: 'Invalid email or password' })
      return
    }
    console.error('Login error:', error)
    res.status(500).json({ error: 'Something went wrong' })
  }
}

export async function refresh(req: Request, res: Response): Promise<void> {
  try {
    const token = req.cookies?.refreshToken

    if (!token) {
      res.status(401).json({ error: 'No refresh token' })
      return
    }

    const accessToken = await AuthService.refreshAccessToken(token)
    res.status(200).json({ accessToken })
  } catch {
    res.status(401).json({ error: 'Invalid refresh token' })
  }
}

export async function logout(_req: Request, res: Response): Promise<void> {
  res.clearCookie('refreshToken', COOKIE_OPTIONS)
  res.status(200).json({ message: 'Logged out' })
}

// backend/src/controllers/auth.controller.ts
// Add this function at the bottom

export async function getMe(req: Request, res: Response): Promise<void> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      select: { id: true, name: true, email: true }
    })

    if (!user) {
      res.status(404).json({ error: 'User not found' })
      return
    }

    res.json(user)
  } catch (err) {
    console.error('getMe error:', err)
    res.status(500).json({ error: 'Failed to fetch user' })
  }
}
// backend/src/controllers/auth.controller.ts — add these three functions

export async function updateProfile(req: Request, res: Response): Promise<void> {
  try {
    const { name, email } = req.body
    if (!name?.trim() || !email?.trim()) {
      res.status(400).json({ error: 'Name and email are required' })
      return
    }

    const existing = await prisma.user.findFirst({
      where: { email, NOT: { id: req.user!.userId } }
    })
    if (existing) {
      res.status(409).json({ error: 'Email already in use' })
      return
    }

    const user = await prisma.user.update({
      where:  { id: req.user!.userId },
      data:   { name: name.trim(), email: email.trim() },
      select: { id: true, name: true, email: true },
    })
    res.json(user)
  } catch (err) {
    console.error('updateProfile error:', err)
    res.status(500).json({ error: 'Failed to update profile' })
  }
}

export async function updatePassword(req: Request, res: Response): Promise<void> {
  try {
    const { currentPassword, newPassword } = req.body
    if (!currentPassword || !newPassword) {
      res.status(400).json({ error: 'Both passwords are required' })
      return
    }
    if (newPassword.length < 8) {
      res.status(400).json({ error: 'New password too short' })
      return
    }

    const user = await prisma.user.findUnique({ where: { id: req.user!.userId } })
    if (!user) { res.status(404).json({ error: 'User not found' }); return }

    const valid = await bcrypt.compare(currentPassword, user.passwordHash)
    if (!valid) { res.status(401).json({ error: 'Incorrect current password' }); return }

    const passwordHash = await bcrypt.hash(newPassword, 12)
    await prisma.user.update({
      where: { id: req.user!.userId },
      data:  { passwordHash },
    })
    res.json({ message: 'Password updated' })
  } catch (err) {
    console.error('updatePassword error:', err)
    res.status(500).json({ error: 'Failed to update password' })
  }
}

export async function deleteAccount(req: Request, res: Response): Promise<void> {
  try {
    // Cascade delete handles tasks, reminders, FCM subscriptions
    await prisma.user.delete({ where: { id: req.user!.userId } })
    res.clearCookie('refreshToken')
    res.json({ message: 'Account deleted' })
  } catch (err) {
    console.error('deleteAccount error:', err)
    res.status(500).json({ error: 'Failed to delete account' })
  }
}