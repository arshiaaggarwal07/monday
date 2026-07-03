// frontend/src/components/board/Board.tsx

import type { Task } from '../../types'
import type { BoardColumn } from '../../hooks/useBoardData'
import StickyNote from './StickyNote'
import AddColumnTile from './AddColumnTile'
import styles from './Board.module.css'

interface BoardProps {
  columns:      BoardColumn[]
  loading:      boolean
  onAddTask:    (taskTypeId: string) => void
  onEditTask:   (task: Task) => void
  onToggleTask: (task: Task) => void
}

export default function Board({
  columns,
  loading,
  onAddTask,
  onEditTask,
  onToggleTask,
}: BoardProps) {
  if (loading) {
    return (
      <div className={styles.grid}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className={styles.skeleton} />
        ))}
      </div>
    )
  }

  return (
    <div className={styles.grid}>
      {columns.map(col => (
        <StickyNote
          key={col.taskType.id}
          taskType={col.taskType}
          tasks={col.tasks}
          onAddTask={onAddTask}
          onEditTask={onEditTask}
          onToggleTask={onToggleTask}
        />
      ))}
      <AddColumnTile onClick={() => {}} />
    </div>
  )
}