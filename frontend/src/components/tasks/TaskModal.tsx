// frontend/src/components/tasks/TaskModal.tsx

import { useEffect, useRef } from 'react'
import type { Task } from '../../types'
import { useTaskTypes, useTaskForm } from '../../hooks/useTasks'
import { Input, Textarea } from '../ui/Input'
import Select  from '../ui/Select'
import Button  from '../ui/Button'
import styles  from './TaskModal.module.css'

const REPEAT_OPTIONS = [
  { value: 'NEVER',    label: 'Never'     },
  { value: 'DAILY',    label: 'Daily'     },
  { value: 'MONDAY',   label: 'Mondays'   },
  { value: 'TUESDAY',  label: 'Tuesdays'  },
  { value: 'WEDNESDAY',label: 'Wednesdays'},
  { value: 'THURSDAY', label: 'Thursdays' },
  { value: 'FRIDAY',   label: 'Fridays'   },
  { value: 'SATURDAY', label: 'Saturdays' },
  { value: 'SUNDAY',   label: 'Sundays'   },
  { value: 'WEEKDAYS', label: 'Weekdays'  },
  { value: 'WEEKENDS', label: 'Weekends'  },
]

interface TaskModalProps {
  existingTask?:  Task | null
  defaultDate?:   Date
  onSaved:        (task: Task, isEdit: boolean) => void
  onClose:        () => void
}

export default function TaskModal({
  existingTask = null,
  defaultDate,
  onSaved,
  onClose,
}: TaskModalProps) {
  const { taskTypes, loading: typesLoading } = useTaskTypes()
  const { fields, setters, errors, submitting, submit } = useTaskForm(existingTask)
  const titleRef = useRef<HTMLInputElement>(null)

  const isEdit = !!existingTask

  // Auto-focus title on open
  useEffect(() => {
    setTimeout(() => titleRef.current?.focus(), 50)
  }, [])

  // Pre-fill date when clicking + on a specific day
  useEffect(() => {
    if (!existingTask && defaultDate) {
      const iso = new Date(defaultDate)
      iso.setHours(9, 0, 0, 0)
      // "2025-06-16T09:00" — format datetime-local expects
      const formatted = iso.toISOString().slice(0, 16)
      setters.setDueDate(formatted)
    }
  }, [defaultDate, existingTask, setters.setDueDate])

  // Set default taskTypeId once types are loaded (create mode only)
  useEffect(() => {
    if (!existingTask && taskTypes.length > 0 && !fields.taskTypeId) {
      setters.setTaskTypeId(taskTypes[0].id)
    }
  }, [taskTypes, existingTask, fields.taskTypeId, setters.setTaskTypeId])

  // Close on Escape key
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div
        className={styles.modal}
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={isEdit ? 'Edit task' : 'New task'}
      >

        {/* ── Header ── */}
        <div className={styles.header}>
          <h2 className={styles.title}>
            {isEdit ? 'Edit commitment' : 'New commitment'}
          </h2>
          <button
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* ── Form ── */}
        <div className={styles.body}>

          {/* Task name */}
          <Input
            ref={titleRef}
            label="What's the commitment?"
            placeholder="e.g. Submit the proposal"
            value={fields.title}
            onChange={e => setters.setTitle(e.target.value)}
            error={errors.title}
          />

          {/* Row: Category + Repeat */}
          <div className={styles.row}>
            <Select
              label="Category"
              value={fields.taskTypeId}
              onChange={e => setters.setTaskTypeId(e.target.value)}
              error={errors.taskTypeId}
              disabled={typesLoading}
            >
              {typesLoading ? (
                <option>Loading...</option>
              ) : (
                taskTypes.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))
              )}
            </Select>

            <Select
              label="Repeat"
              value={fields.repeatType}
              onChange={e => setters.setRepeatType(e.target.value as typeof fields.repeatType)}
            >
              {REPEAT_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </Select>
          </div>

          {/* Due date */}
          <Input
            label="Due date & time"
            type="datetime-local"
            value={fields.dueDate}
            onChange={e => setters.setDueDate(e.target.value)}
            hint="Leave empty for tasks without a deadline"
          />

          {/* Description */}
          <Textarea
            label="Notes (optional)"
            placeholder="Context, links, anything relevant..."
            value={fields.description}
            onChange={e => setters.setDescription(e.target.value)}
          />

          {/* Form-level error */}
          {errors.form && (
            <p className={styles.formError}>{errors.form}</p>
          )}
        </div>

        {/* ── Footer ── */}
        <div className={styles.footer}>
          {/* Reminder toggle */}
          <button
            type="button"
            className={`${styles.reminderToggle} ${fields.reminderEnabled ? styles.reminderOn : ''}`}
            onClick={() => setters.setReminderEnabled(v => !v)}
            aria-pressed={fields.reminderEnabled}
          >
            <span className={styles.reminderIcon}>
              {fields.reminderEnabled ? '🔔' : '🔕'}
            </span>
            <span>
              {fields.reminderEnabled ? 'Reminder on' : 'No reminder'}
            </span>
          </button>

          <div className={styles.actions}>
            <Button variant="ghost" onClick={onClose} disabled={submitting}>
              Cancel
            </Button>
            <Button
              onClick={() => submit(onSaved)}
              loading={submitting}
            >
              {isEdit ? 'Save changes' : 'Confirm task'}
            </Button>
          </div>
        </div>

      </div>
    </div>
  )
}