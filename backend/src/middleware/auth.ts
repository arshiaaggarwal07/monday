// backend/src/middleware/auth.ts

import { Request, Response, NextFunction } from 'express'
import { verifyAccessToken } from '../utils/jwt'

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'No token provided' })
    return
  }

  const token = authHeader.split(' ')[1]

  try {
    const payload = verifyAccessToken(token)
    req.user = payload   // now available as req.user in any controller
    next()               // pass control to the next handler
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' })
  }
}