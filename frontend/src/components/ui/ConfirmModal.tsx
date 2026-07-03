// frontend/src/components/ui/ConfirmModal.tsx

import Button from './Button'
import styles from './ConfirmModal.module.css'

interface ConfirmModalProps {
  title:      string
  message:    string
  confirmLabel?: string
  onConfirm:  () => void
  onCancel:   () => void
  danger?:    boolean
  loading?:   boolean
}

export default function ConfirmModal({
  title,
  message,
  confirmLabel = 'Confirm',
  onConfirm,
  onCancel,
  danger   = false,
  loading  = false,
}: ConfirmModalProps) {
  return (
    <div className={styles.backdrop} onClick={onCancel}>
      <div
        className={styles.modal}
        onClick={e => e.stopPropagation()}
        role="alertdialog"
        aria-modal="true"
      >
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.message}>{message}</p>
        <div className={styles.actions}>
          <Button variant="ghost" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant={danger ? 'danger' : 'primary'}
            onClick={onConfirm}
            loading={loading}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}