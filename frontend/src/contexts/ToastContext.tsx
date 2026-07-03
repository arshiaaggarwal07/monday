// frontend/src/contexts/ToastContext.tsx
import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
} from 'react'

import type { ReactNode } from 'react'
import styles from './ToastContext.module.css'

type ToastType = 'success' | 'error' | 'info'

interface Toast {
  id:      string
  message: string
  type:    ToastType
}

interface ToastContextType {
  toast: (message: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextType | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({})

  const dismiss = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
    clearTimeout(timers.current[id])
    delete timers.current[id]
  }, [])

  const toast = useCallback((message: string, type: ToastType = 'success') => {
    const id = `${Date.now()}-${Math.random()}`
    setToasts(prev => [...prev, { id, message, type }])

    // Auto-dismiss after 3.5s
    timers.current[id] = setTimeout(() => dismiss(id), 3500)
  }, [dismiss])

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}

      {/* Toast stack — renders outside the normal document flow */}
      <div className={styles.stack} aria-live="polite" aria-atomic="false">
        {toasts.map(t => (
          <div
            key={t.id}
            className={`${styles.toast} ${styles[t.type]}`}
            onClick={() => dismiss(t.id)}
            role="status"
          >
            <span className={styles.icon}>
              {t.type === 'success' && '✓'}
              {t.type === 'error'   && '✕'}
              {t.type === 'info'    && '·'}
            </span>
            <span className={styles.message}>{t.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside ToastProvider')
  return ctx.toast
}