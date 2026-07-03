// frontend/src/components/board/AddColumnTile.tsx

import styles from './AddColumnTile.module.css'

interface AddColumnTileProps {
  onClick: () => void
}

export default function AddColumnTile({ onClick }: AddColumnTileProps) {
  return (
    <button className={styles.tile} onClick={onClick} aria-label="Add new category">
      <span className={styles.plus}>+</span>
    </button>
  )
}