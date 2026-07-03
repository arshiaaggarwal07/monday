// backend/src/routes/task.routes.ts

import { Router } from 'express'
import { requireAuth } from '../middleware/auth'
import * as TaskController from '../controllers/task.controller'

const router = Router()

// All task routes require authentication
router.use(requireAuth)

// Task types — must come before /:id routes to avoid route collision
router.get('/task-types', TaskController.getTaskTypes)

// Calendar
router.get('/calendar', TaskController.getCalendar)

// Task CRUD
router.get   ('/',       requireAuth,    TaskController.getTasks)
router.post  ('/',       requireAuth,    TaskController.createTask)
router.get   ('/:id',     requireAuth,   TaskController.getTask)
router.put   ('/:id',    requireAuth,    TaskController.updateTask)
router.delete('/:id',    requireAuth,    TaskController.deleteTask)
router.patch ('/:id/complete', requireAuth,TaskController.toggleComplete)

export default router