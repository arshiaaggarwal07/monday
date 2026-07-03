// frontend/src/components/ui/Badge.tsx

import styles from './Badge.module.css'
import type { ReactNode } from 'react'

type BadgeVariant = 'default' | 'success' | 'warning' | 'muted'

interface BadgeProps {
  children: ReactNode
  variant?: BadgeVariant
}

export default function Badge({ children, variant = 'default' }: BadgeProps) {
  return (
    <span className={`${styles.badge} ${styles[variant]}`}>
      {children}
    </span>
  )
}