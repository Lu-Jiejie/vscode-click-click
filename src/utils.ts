export function isUndefinedOrNull(value: any): value is undefined | null {
  return value === undefined || value === null
}
