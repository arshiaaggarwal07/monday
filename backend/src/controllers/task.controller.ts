// backend/src/controllers/task.controller.ts

import { Request, Response } from 'express'
import * as TaskService from '../services/task.service'

// ─── Task Types ──────────────────────────────────────────────────────────────

export async function getTaskTypes(_req: Request, res: Response): Promise<void> {
  try {
    const types = await TaskService.getAllTaskTypes()
    res.json(types)
  } catch (err) {
    console.error('getTaskTypes error:', err)
    res.status(500).json({ error: 'Failed to fetch task types' })
  }
}

// ─── Tasks ───────────────────────────────────────────────────────────────────

export async function getTasks(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user!.userId

    const { taskTypeId, completed, dueBefore, dueAfter } = req.query

    const tasks = await TaskService.getUserTasks(userId, {
      taskTypeId: taskTypeId as string | undefined,
      completed: completed !== undefined ? completed === 'true' : undefined,
      dueBefore: dueBefore ? new Date(dueBefore as string) : undefined,
      dueAfter: dueAfter ? new Date(dueAfter as string) : undefined,
    })

    res.json(tasks)
  } catch (err) {
    console.error('getTasks error:', err)
    res.status(500).json({ error: 'Failed to fetch tasks' })
  }
}

export async function getTask(
  req: Request<{ id: string }>,
  res: Response
): Promise<void> {
  try {
    const task = await TaskService.getTaskById(
      req.params.id,
      req.user!.userId
    )

    if (!task) {
      res.status(404).json({ error: 'Task not found' })
      return
    }

    res.json(task)
  } catch (err) {
    console.error('getTask error:', err)
    res.status(500).json({ error: 'Failed to fetch task' })
  }
}

export async function createTask(req: Request, res: Response): Promise<void> {
  try {
    const { title, description, taskTypeId, repeatType, dueDate, reminderEnabled } = req.body

    if (!title?.trim()) {
      res.status(400).json({ error: 'Task title is required' })
      return
    }

    if (!taskTypeId) {
      res.status(400).json({ error: 'Task type is required' })
      return
    }

    const task = await TaskService.createTask(req.user!.userId, {
      title,
      description,
      taskTypeId,
      repeatType,
      dueDate,
      reminderEnabled,
    })

    res.status(201).json(task)

  } catch (err) {
    const error = err as Error

    if (error.message === 'INVALID_TASK_TYPE') {
      res.status(400).json({ error: 'Invalid task type' })
      return
    }

    console.error('createTask error:', err)
    res.status(500).json({ error: 'Failed to create task' })
  }
}

export async function updateTask(
  req: Request<{ id: string }>,
  res: Response
): Promise<void> {
  try {
    const task = await TaskService.updateTask(
      req.params.id,
      req.user!.userId,
      req.body
    )

    if (!task) {
      res.status(404).json({ error: 'Task not found' })
      return
    }

    res.json(task)

  } catch (err) {

    const error = err as Error

    if (error.message === 'INVALID_TASK_TYPE') {
      res.status(400).json({ error: 'Invalid task type' })
      return
    }

    console.error('updateTask error:', err)
    res.status(500).json({ error: 'Failed to update task' })
  }
}

export async function toggleComplete(
  req: Request<{ id: string }>,
  res: Response
): Promise<void> {
  try {
    const task = await TaskService.toggleTaskComplete(
      req.params.id,
      req.user!.userId
    )

    if (!task) {
      res.status(404).json({ error: 'Task not found' })
      return
    }

    res.json(task)

  } catch (err) {
    console.error('toggleComplete error:', err)
    res.status(500).json({ error: 'Failed to update task' })
  }
}

export async function deleteTask(
  req: Request<{ id: string }>,
  res: Response
): Promise<void> {
  try {
    const deleted = await TaskService.deleteTask(
      req.params.id,
      req.user!.userId
    )

    if (!deleted) {
      res.status(404).json({ error: 'Task not found' })
      return
    }

    res.status(204).send()

  } catch (err) {
    console.error('deleteTask error:', err)
    res.status(500).json({ error: 'Failed to delete task' })
  }
}

export async function getCalendar(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { start, end } = req.query

    if (!start || !end) {
      res.status(400).json({ error: 'start and end query params are required' })
      return
    }

    const startDate = new Date(start as string)
    const endDate = new Date(end as string)

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      res.status(400).json({ error: 'Invalid date format' })
      return
    }

    const tasks = await TaskService.getTasksInRange(
      req.user!.userId,
      startDate,
      endDate
    )

    res.json(tasks)

  } catch (err) {
    console.error('getCalendar error:', err)
    res.status(500).json({ error: 'Failed to fetch calendar tasks' })
  }
}