export function isWholeNumber(value: string) {
  return /^\d+$/.test(value.trim());
}
