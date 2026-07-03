// frontend/src/components/board/StickyNote.tsx

import type { Task } from '../../types'
import { taskApi } from '../../api/tasks'
import { getTypeColor } from '../../config/taskTypeColors'
import styles from './StickyNote.module.css'

interface StickyNoteProps {
  taskType: { id: string; name: string }
  tasks:    Task[]
  onAddTask:    (taskTypeId: string) => void
  onEditTask:   (task: Task) => void
  onToggleTask: (task: Task) => void
}

export default function StickyNote({
  taskType,
  tasks,
  onAddTask,
  onEditTask,
  onToggleTask,
}: StickyNoteProps) {
  const color = getTypeColor(taskType.name)

  async function handleToggle(e: React.MouseEvent, task: Task) {
    e.stopPropagation()
    try {
      const updated = await taskApi.toggleComplete(task.id)
      onToggleTask(updated)
    } catch (err) {
      console.error('Toggle error:', err)
    }
  }

  return (
    <div className={styles.note} style={{ background: color }}>
      <div className={styles.header}>
        <h3 className={styles.title}>{taskType.name}</h3>
        <button
          className={styles.addBtn}
          onClick={() => onAddTask(taskType.id)}
          aria-label={`Add task to ${taskType.name}`}
        >
          +
        </button>
      </div>

      <div className={styles.list}>
        {tasks.length === 0 ? (
          <p className={styles.emptyHint}>Nothing here yet</p>
        ) : (
          tasks.map(task => (
            <div
              key={task.id}
              className={styles.item}
              onClick={() => onEditTask(task)}
            >
              <button
                className={styles.checkbox}
                onClick={e => handleToggle(e, task)}
                aria-label="Mark complete"
              />
              <span className={styles.itemText}>{task.title}</span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}