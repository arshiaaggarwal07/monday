// backend/src/utils/jwt.ts

import jwt from 'jsonwebtoken'
import { JwtPayload } from '../types'

const ACCESS_SECRET  = process.env.JWT_SECRET!
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!

// ! after process.env.X tells TypeScript:
// "I know this could be undefined, but I'm guaranteeing it won't be at runtime."
// Use sparingly — only when you've confirmed the value exists (like env vars loaded via dotenv).

export function signAccessToken(payload: JwtPayload): string {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: '15m' })
}

export function signRefreshToken(payload: JwtPayload): string {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: '7d' })
}

export function verifyAccessToken(token: string): JwtPayload {
  return jwt.verify(token, ACCESS_SECRET) as JwtPayload
}

export function verifyRefreshToken(token: string): JwtPayload {
  return jwt.verify(token, REFRESH_SECRET) as JwtPayload
}