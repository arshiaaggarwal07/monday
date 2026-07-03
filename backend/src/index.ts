// backend/src/index.ts

import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'

import authRoutes from './routes/auth.routes'
import taskRoutes from './routes/task.routes'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// app.use(cors({
//   origin: process.env.FRONTEND_URL || 'http://localhost:5173',
//   credentials: true,
// }))
app.use(express.json())
app.use(cookieParser())

app.get('/api/ping', (_req, res) => {
  res.json({ message: 'pong', timestamp: new Date().toISOString() })
})

app.use('/api/auth',  authRoutes)
app.use('/api/tasks', taskRoutes)

// Note: /api/task-types and /api/calendar are nested under /api/tasks
// Full paths: /api/tasks/task-types and /api/tasks/calendar

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})

export default app