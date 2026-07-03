// frontend/src/utils/dates.ts

// Returns "Monday, June 16" style label
export function formatDayLabel(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month:   'long',
    day:     'numeric',
  })
}

// Returns "Jun 16" for compact display
export function formatShortDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day:   'numeric',
  })
}

// Returns ISO date string "2025-06-16" for API calls
export function toISODate(date: Date): string {
  return date.toISOString().split('T')[0]
}

// True if two dates fall on the same calendar day
export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth()    === b.getMonth()    &&
    a.getDate()     === b.getDate()
  )
}

// True if date is today
export function isToday(date: Date): boolean {
  return isSameDay(date, new Date())
}

// True if date is in the past (before today, not including today)
export function isPast(date: Date): boolean {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return date < today
}

// Add N days to a date, returns new Date (does not mutate)
export function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

// Generate an array of Date objects for a range
export function generateDateRange(start: Date, count: number): Date[] {
  return Array.from({ length: count }, (_, i) => addDays(start, i))
}

// Return start and end of a window around a centre date
export function getDateWindow(centre: Date, daysBefore: number, daysAfter: number) {
  return {
    start: addDays(centre, -daysBefore),
    end:   addDays(centre,  daysAfter),
  }
}