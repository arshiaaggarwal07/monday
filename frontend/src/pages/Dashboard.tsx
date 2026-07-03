// // frontend/src/pages/Dashboard.tsx

// import { useState, useCallback, useEffect } from 'react'
// import { useSearchParams } from 'react-router-dom'
// import type { Task } from '../types'
// import { useMonthCalendar } from '../hooks/useMonthCalendar'
// import { useBoardData }     from '../hooks/useBoardData'
// import { taskApi }          from '../api/tasks'
// import { useToast }         from '../contexts/ToastContext'
// import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts'
// import DashboardLayout from '../components/layout/DashboardLayout'
// import MonthCalendar   from '../components/calendar/MonthCalendar'
// import Board            from '../components/board/Board'
// import TaskModal       from '../components/tasks/TaskModal'
// import ConfirmModal    from '../components/ui/ConfirmModal'
// import styles from './Dashboard.module.css'

// export default function Dashboard() {
//   const toast = useToast()
//   const [searchParams] = useSearchParams()
//   const view = searchParams.get('view')   // 'board' | 'calendar' | null (default = calendar)

//   const [taskModalOpen, setTaskModalOpen] = useState(false)
//   const [selectedDate,  setSelectedDate]  = useState<Date | undefined>()
//   const [presetTypeId,  setPresetTypeId]  = useState<string | undefined>()
//   const [editingTask,   setEditingTask]   = useState<Task | null>(null)
//   const [deletingTask,  setDeletingTask]  = useState<Task | null>(null)
//   const [deleteLoading, setDeleteLoading] = useState(false)

//   useEffect(() => { document.title = 'Dashboard — Monday' }, [])

//   const monthCalendar = useMonthCalendar()
//   const board         = useBoardData()

//   const handleNewTask = useCallback((date?: Date, typeId?: string) => {
//     setEditingTask(null)
//     setSelectedDate(date)
//     setPresetTypeId(typeId)
//     setTaskModalOpen(true)
//   }, [])

//   const handleEditTask = useCallback((task: Task) => {
//     setEditingTask(task)
//     setSelectedDate(undefined)
//     setPresetTypeId(undefined)
//     setTaskModalOpen(true)
//   }, [])

//   const handleDeleteTask = useCallback((task: Task) => {
//     setDeletingTask(task)
//   }, [])

//   const handleConfirmDelete = useCallback(async () => {
//     if (!deletingTask) return
//     setDeleteLoading(true)
//     try {
//       await taskApi.deleteTask(deletingTask.id)
//       monthCalendar.removeTask(deletingTask)
//       board.removeTaskFromColumn(deletingTask)
//       toast('Task deleted')
//     } catch {
//       toast('Failed to delete task', 'error')
//     } finally {
//       setDeleteLoading(false)
//       setDeletingTask(null)
//     }
//   }, [deletingTask, monthCalendar, board, toast])

//   const handleToggleTask = useCallback((updatedTask: Task) => {
//     monthCalendar.updateTask(updatedTask)
//     if (updatedTask.completed) {
//       board.completeTaskInColumn(updatedTask)
//     }
//     toast(updatedTask.completed ? 'Marked complete' : 'Marked incomplete')
//   }, [monthCalendar, board, toast])

//   const handleModalClose = useCallback(() => {
//     setTaskModalOpen(false)
//     setEditingTask(null)
//     setSelectedDate(undefined)
//     setPresetTypeId(undefined)
//   }, [])

//   const handleTaskSaved = useCallback((task: Task, isEdit: boolean) => {
//     if (isEdit) {
//       monthCalendar.updateTask(task)
//       board.updateTaskInColumn(task)
//       toast('Task updated')
//     } else {
//       monthCalendar.addTask(task)
//       board.addTaskToColumn(task)
//       toast('Commitment added')
//     }
//     handleModalClose()
//   }, [monthCalendar, board, handleModalClose, toast])

//   useKeyboardShortcuts({ onNewTask: () => handleNewTask() })

//   return (
//     <DashboardLayout onNewTask={() => handleNewTask()}>
//       {view === 'board' ? (
//         <div className={styles.boardWrapper}>
//           <Board
//             columns={board.columns}
//             loading={board.loading}
//             onAddTask={(typeId) => handleNewTask(undefined, typeId)}
//             onEditTask={handleEditTask}
//             onToggleTask={handleToggleTask}
//           />
//         </div>
//       ) : (
//         <MonthCalendar
//           monthDate={monthCalendar.monthDate}
//           grid={monthCalendar.grid}
//           loading={monthCalendar.loading}
//           getTasksForDate={monthCalendar.getTasksForDate}
//           goNext={monthCalendar.goNext}
//           goPrev={monthCalendar.goPrev}
//           goToday={monthCalendar.goToday}
//           onNewTask={handleNewTask}
//           onEditTask={handleEditTask}
//         />
//       )}

//       {taskModalOpen && (
//         <TaskModal
//           existingTask={editingTask}
//           defaultDate={selectedDate}
//           onSaved={handleTaskSaved}
//           onClose={handleModalClose}
//         />
//       )}

//       {deletingTask && (
//         <ConfirmModal
//           title="Delete this commitment?"
//           message={`"${deletingTask.title}" will be permanently removed.`}
//           confirmLabel="Delete"
//           danger
//           loading={deleteLoading}
//           onConfirm={handleConfirmDelete}
//           onCancel={() => setDeletingTask(null)}
//         />
//       )}
//     </DashboardLayout>
//   )
// }


// frontend/src/pages/Dashboard.tsx

import { useState, useCallback, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { Task } from '../types'
import { useMonthCalendar } from '../hooks/useMonthCalendar'
import { useBoardData }     from '../hooks/useBoardData'
import { useListView }      from '../hooks/useListView'
import { taskApi }          from '../api/tasks'
import { useToast }         from '../contexts/ToastContext'
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts'
import DashboardLayout from '../components/layout/DashboardLayout'
import MonthCalendar   from '../components/calendar/MonthCalendar'
import Board           from '../components/board/Board'
import ListView        from '../components/lists/ListView'
import TaskModal       from '../components/tasks/TaskModal'
import ConfirmModal    from '../components/ui/ConfirmModal'
import { NAV_GROUPS }  from '../config/navigation'
import styles from './Dashboard.module.css'

export default function Dashboard() {
  const toast = useToast()
  const [searchParams] = useSearchParams()
  const view = searchParams.get('view')
  const list = searchParams.get('list')

  const [taskModalOpen, setTaskModalOpen] = useState(false)
  const [selectedDate,  setSelectedDate]  = useState<Date | undefined>()
  const [editingTask,   setEditingTask]   = useState<Task | null>(null)
  const [deletingTask,  setDeletingTask]  = useState<Task | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  useEffect(() => { document.title = 'Dashboard — Monday' }, [])

  const monthCalendar = useMonthCalendar()
  const board         = useBoardData()
  const listView      = useListView(list ?? '')

  // Derive the human label for the active list from navigation config
  const activeListItem = NAV_GROUPS
    .flatMap(g => g.items)
    .find(item => item.id === list)
  const listLabel = activeListItem?.label ?? 'List'

  const handleNewTask = useCallback((date?: Date) => {
    setEditingTask(null)
    setSelectedDate(date)
    setTaskModalOpen(true)
  }, [])

  const handleEditTask = useCallback((task: Task) => {
    setEditingTask(task)
    setSelectedDate(undefined)
    setTaskModalOpen(true)
  }, [])

  const handleDeleteTask = useCallback((task: Task) => {
    setDeletingTask(task)
  }, [])

  const handleConfirmDelete = useCallback(async () => {
    if (!deletingTask) return
    setDeleteLoading(true)
    try {
      await taskApi.deleteTask(deletingTask.id)
      monthCalendar.removeTask(deletingTask)
      board.removeTaskFromColumn(deletingTask)
      listView.removeTask(deletingTask)
      toast('Task deleted')
    } catch {
      toast('Failed to delete task', 'error')
    } finally {
      setDeleteLoading(false)
      setDeletingTask(null)
    }
  }, [deletingTask, monthCalendar, board, listView, toast])

  const handleToggleTask = useCallback((updatedTask: Task) => {
    monthCalendar.updateTask(updatedTask)
    listView.updateTask(updatedTask)
    if (updatedTask.completed) board.completeTaskInColumn(updatedTask)
  }, [monthCalendar, board, listView])

  const handleModalClose = useCallback(() => {
    setTaskModalOpen(false)
    setEditingTask(null)
    setSelectedDate(undefined)
  }, [])

  const handleTaskSaved = useCallback((task: Task, isEdit: boolean) => {
    if (isEdit) {
      monthCalendar.updateTask(task)
      board.updateTaskInColumn(task)
      listView.updateTask(task)
      toast('Task updated')
    } else {
      monthCalendar.addTask(task)
      board.addTaskToColumn(task)
      listView.addTask(task)
      toast('Commitment added')
    }
    handleModalClose()
  }, [monthCalendar, board, listView, handleModalClose, toast])

  useKeyboardShortcuts({ onNewTask: () => handleNewTask() })

  // Determine which view to render
  const isListView = Boolean(list)
  const isBoardView = view === 'board'

  return (
    <DashboardLayout onNewTask={() => handleNewTask()}>

      {isListView ? (
        <ListView
          tasks={listView.tasks}
          loading={listView.loading}
          listLabel={listLabel}
          taskTypeName={listView.taskTypeName}
          onEditTask={handleEditTask}
          onTaskToggled={handleToggleTask}
          onTaskDeleted={(task) => {
            listView.removeTask(task)
            monthCalendar.removeTask(task)
            board.removeTaskFromColumn(task)
            toast('Task deleted')
          }}
          onNewTask={() => handleNewTask()}
        />
      ) : isBoardView ? (
        <div className={styles.boardWrapper}>
          <Board
            columns={board.columns}
            loading={board.loading}
            onAddTask={() => handleNewTask()}
            onEditTask={handleEditTask}
            onToggleTask={handleToggleTask}
          />
        </div>
      ) : (
        <MonthCalendar
          monthDate={monthCalendar.monthDate}
          grid={monthCalendar.grid}
          loading={monthCalendar.loading}
          getTasksForDate={monthCalendar.getTasksForDate}
          goNext={monthCalendar.goNext}
          goPrev={monthCalendar.goPrev}
          goToday={monthCalendar.goToday}
          onNewTask={handleNewTask}
          onEditTask={handleEditTask}
        />
      )}

      {taskModalOpen && (
        <TaskModal
          existingTask={editingTask}
          defaultDate={selectedDate}
          onSaved={handleTaskSaved}
          onClose={handleModalClose}
        />
      )}

      {deletingTask && (
        <ConfirmModal
          title="Delete this commitment?"
          message={`"${deletingTask.title}" will be permanently removed.`}
          confirmLabel="Delete"
          danger
          loading={deleteLoading}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeletingTask(null)}
        />
      )}
    </DashboardLayout>
  )
}