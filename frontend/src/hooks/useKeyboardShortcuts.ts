// frontend/src/hooks/useKeyboardShortcuts.ts

import { useEffect } from 'react'

interface Shortcuts {
  onNewTask: () => void
}

export function useKeyboardShortcuts({ onNewTask }: Shortcuts) {
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      // Ignore if focus is inside an input/textarea
      const tag = (e.target as HTMLElement).tagName
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(tag)) return

      // N → new task
      if (e.key === 'n' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault()
        onNewTask()
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onNewTask])
}