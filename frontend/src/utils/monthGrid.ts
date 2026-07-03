// frontend/src/utils/monthGrid.ts

export interface MonthCell {
  date:          Date
  isCurrentMonth: boolean
  isToday:        boolean
}

// Returns the first day of the given month
export function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

// Returns the last day of the given month
export function endOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0)
}

export function addMonths(date: Date, count: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + count, 1)
}

export function formatMonthLabel(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth()    === b.getMonth()    &&
    a.getDate()     === b.getDate()
  )
}

// frontend/src/utils/monthGrid.ts
// Replace ONLY the toISODate function, everything else stays the same

export function toISODate(date: Date): string {
  // Read LOCAL date parts — do NOT use toISOString() which gives UTC
  const year  = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day   = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// Builds the full grid of cells for a given month, including
// leading days from the previous month and trailing days from the next,
// so the grid always fills complete weeks (always a multiple of 7 cells).
export function buildMonthGrid(monthDate: Date): MonthCell[] {
  const today      = new Date()
  today.setHours(0, 0, 0, 0)

  const first      = startOfMonth(monthDate)
  const last       = endOfMonth(monthDate)

  // getDay() returns 0 (Sun) - 6 (Sat). We want the grid to start on Sunday.
  const leadingCount = first.getDay()

  const totalDaysInMonth = last.getDate()
  const cells: MonthCell[] = []

  // Leading days from previous month
  for (let i = leadingCount; i > 0; i--) {
    const date = new Date(first)
    date.setDate(date.getDate() - i)
    cells.push({ date, isCurrentMonth: false, isToday: isSameDay(date, today) })
  }

  // Days in current month
  for (let d = 1; d <= totalDaysInMonth; d++) {
    const date = new Date(monthDate.getFullYear(), monthDate.getMonth(), d)
    cells.push({ date, isCurrentMonth: true, isToday: isSameDay(date, today) })
  }

  // Trailing days from next month — fill out to a multiple of 7
  const remainder = cells.length % 7
  const trailingCount = remainder === 0 ? 0 : 7 - remainder

  for (let d = 1; d <= trailingCount; d++) {
    const date = new Date(last)
    date.setDate(date.getDate() + d)
    cells.push({ date, isCurrentMonth: false, isToday: isSameDay(date, today) })
  }

  return cells
}