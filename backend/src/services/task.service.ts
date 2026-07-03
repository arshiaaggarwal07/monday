// backend/src/services/task.service.ts

import prisma from '../utils/prisma'
import { CreateTaskInput, UpdateTaskInput } from '../types'

// ─── Read ────────────────────────────────────────────────────────────────────

export async function getUserTasks(
  userId: string,
  filters: {
    taskTypeId?: string
    completed?: boolean
    dueBefore?: Date
    dueAfter?: Date
  } = {}
) {
  return prisma.task.findMany({
    where: {
      userId,
      // Only add filter fields if they were actually passed in
      ...(filters.taskTypeId  && { taskTypeId: filters.taskTypeId }),
      ...(filters.completed   !== undefined && { completed: filters.completed }),
      ...(filters.dueBefore || filters.dueAfter
        ? {
            dueDate: {
              ...(filters.dueAfter  && { gte: filters.dueAfter }),
              ...(filters.dueBefore && { lte: filters.dueBefore }),
            }
          }
        : {}),
    },
    include: {
      taskType: {
        select: { id: true, name: true }
      }
    },
    orderBy: [
      { dueDate: 'asc' },
      { createdAt: 'desc' }
    ]
  })
}

export async function getTaskById(taskId: string, userId: string) {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: {
      taskType: { select: { id: true, name: true } }
    }
  })

  // Return null if not found OR if it belongs to a different user
  if (!task || task.userId !== userId) return null

  return task
}

export async function getTasksInRange(
  userId: string,
  start: Date,
  end: Date
) {
  return prisma.task.findMany({
    where: {
      userId,
      dueDate: {
        gte: start,
        lte: end,
      }
    },
    include: {
      taskType: { select: { id: true, name: true } }
    },
    orderBy: { dueDate: 'asc' }
  })
}

// ─── Create ──────────────────────────────────────────────────────────────────

export async function createTask(userId: string, input: CreateTaskInput) {
  // Verify the taskTypeId actually exists in the DB
  const taskType = await prisma.taskType.findUnique({
    where: { id: input.taskTypeId }
  })

  if (!taskType) throw new Error('INVALID_TASK_TYPE')

  return prisma.task.create({
    data: {
      userId,
      title:          input.title.trim(),
      description:    input.description?.trim(),
      taskTypeId:     input.taskTypeId,
      repeatType:     input.repeatType ?? 'NEVER',
      dueDate:        input.dueDate ? new Date(input.dueDate) : null,
      reminderEnabled: input.reminderEnabled ?? false,
    },
    include: {
      taskType: { select: { id: true, name: true } }
    }
  })
}

// ─── Update ──────────────────────────────────────────────────────────────────

export async function updateTask(
  taskId: string,
  userId: string,
  input: UpdateTaskInput
) {
  // Ownership check first
  const existing = await prisma.task.findUnique({ where: { id: taskId } })
  if (!existing || existing.userId !== userId) return null

  if (input.taskTypeId) {
    const taskType = await prisma.taskType.findUnique({
      where: { id: input.taskTypeId }
    })
    if (!taskType) throw new Error('INVALID_TASK_TYPE')
  }

  return prisma.task.update({
    where: { id: taskId },
    data: {
      ...(input.title          && { title: input.title.trim() }),
      ...(input.description    !== undefined && { description: input.description?.trim() }),
      ...(input.taskTypeId     && { taskTypeId: input.taskTypeId }),
      ...(input.repeatType     && { repeatType: input.repeatType }),
      ...(input.dueDate        !== undefined && {
        dueDate: input.dueDate ? new Date(input.dueDate) : null
      }),
      ...(input.reminderEnabled !== undefined && {
        reminderEnabled: input.reminderEnabled
      }),
    },
    include: {
      taskType: { select: { id: true, name: true } }
    }
  })
}

export async function toggleTaskComplete(taskId: string, userId: string) {
  const existing = await prisma.task.findUnique({ where: { id: taskId } })
  if (!existing || existing.userId !== userId) return null

  return prisma.task.update({
    where: { id: taskId },
    data: { completed: !existing.completed },
    include: {
      taskType: { select: { id: true, name: true } }
    }
  })
}

// ─── Delete ──────────────────────────────────────────────────────────────────

export async function deleteTask(taskId: string, userId: string) {
  const existing = await prisma.task.findUnique({ where: { id: taskId } })
  if (!existing || existing.userId !== userId) return false

  await prisma.task.delete({ where: { id: taskId } })
  return true
}

// ─── Task Types ──────────────────────────────────────────────────────────────

export async function getAllTaskTypes() {
  return prisma.taskType.findMany({
    orderBy: { name: 'asc' }
  })
}