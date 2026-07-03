// frontend/src/components/ui/Select.tsx

import type { SelectHTMLAttributes } from 'react'
import styles from './Select.module.css'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?:   string
  error?:   string
  hint?:    string
}

export default function Select({ label, error, hint, className = '', children, ...rest }: SelectProps) {
  return (
    <div className={styles.wrapper}>
      {label && <label className={styles.label}>{label}</label>}
      <select
        className={`${styles.select} ${error ? styles.hasError : ''} ${className}`}
        {...rest}
      >
        {children}
      </select>
      {error && <p className={styles.error}>{error}</p>}
      {hint  && !error && <p className={styles.hint}>{hint}</p>}
    </div>
  )
}