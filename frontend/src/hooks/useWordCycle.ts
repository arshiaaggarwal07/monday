// frontend/src/hooks/useWordCycle.ts

import { useState, useEffect } from 'react'

export function useWordCycle(words: string[], intervalMs: number = 1500) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex(prev => (prev + 1) % words.length)
    }, intervalMs)
    return () => clearInterval(timer)
  }, [words.length, intervalMs])

  return words[index]
}