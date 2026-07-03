// frontend/src/config/taskTypeColors.ts

// Maps each task type name to a sticky-note color token.
// Falls back to gray for any type not explicitly listed.
const TYPE_COLOR_MAP: Record<string, string> = {
  Work:     'var(--color-note-blue)',
  Personal: 'var(--color-note-yellow)',
  Family:   'var(--color-note-pink)',
  Friends:  'var(--color-note-purple)',
  College:  'var(--color-note-green)',
  Health:   'var(--color-note-orange)',
  Other:    'var(--color-note-gray)',
}

export function getTypeColor(typeName: string): string {
  return TYPE_COLOR_MAP[typeName] ?? 'var(--color-note-gray)'
}