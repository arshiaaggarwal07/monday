// frontend/src/components/ui/Input.tsx

import { forwardRef } from 'react'
import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react'
import styles from './Input.module.css'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  function Input(
    { label, error, hint, className = '', ...rest },
    ref
  ) {
    return (
      <div className={styles.wrapper}>
        {label && <label className={styles.label}>{label}</label>}

        <input
          ref={ref}
          className={`${styles.input} ${error ? styles.hasError : ''} ${className}`}
          {...rest}
        />

        {error && <p className={styles.error}>{error}</p>}
        {hint && !error && <p className={styles.hint}>{hint}</p>}
      </div>
    )
  }
)

export function Textarea({
  label,
  error,
  hint,
  className = '',
  ...rest
}: TextareaProps) {
  return (
    <div className={styles.wrapper}>
      {label && <label className={styles.label}>{label}</label>}

      <textarea
        className={`${styles.textarea} ${error ? styles.hasError : ''} ${className}`}
        {...rest}
      />

      {error && <p className={styles.error}>{error}</p>}
      {hint && !error && <p className={styles.hint}>{hint}</p>}
    </div>
  )
}