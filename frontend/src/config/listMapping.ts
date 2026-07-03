// frontend/src/config/listMapping.ts

// Maps sidebar list IDs to the actual TaskType names in the database.
// We match by name (not ID) since IDs are UUIDs generated at seed time.
export const LIST_TO_TASK_TYPE: Record<string, string> = {
  personal:     'Personal',
  professional: 'Work',
  home:         'Other',
  school:       'College',
  work:         'Work',
  family:       'Family',
}

// Returns the TaskType name for a given list param, or null if unrecognised
export function getTaskTypeName(listParam: string): string | null {
  return LIST_TO_TASK_TYPE[listParam.toLowerCase()] ?? null
}