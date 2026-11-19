export class ActivityResponseError extends Error {
  constructor() { super('The activity response does not match the expected format. Please confirm the response contract with the backend.'); }
}
export function object(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new ActivityResponseError();
  return value as Record<string, unknown>;
}
export function number(value: unknown): number {
  const parsed = typeof value === 'string' && value.trim() !== '' ? Number(value) : value;
  if (typeof parsed !== 'number' || !Number.isFinite(parsed) || Math.abs(parsed) > Number.MAX_SAFE_INTEGER) throw new ActivityResponseError();
  return parsed;
}
export function integer(value: unknown): number {
  const parsed = number(value);
  if (!Number.isInteger(parsed)) throw new ActivityResponseError();
  return parsed;
}
export function count(value: unknown): number {
  const parsed = integer(value);
  if (parsed < 0) throw new ActivityResponseError();
  return parsed;
}
export function text(value: unknown): string {
  if (typeof value !== 'string') throw new ActivityResponseError();
  return value;
}
export function optionalText(value: unknown) { return typeof value === 'string' && value.trim() ? value : null; }
export function timestamp(value: unknown) {
  const parsed = text(value);
  if (!Number.isFinite(Date.parse(parsed))) throw new ActivityResponseError();
  return parsed;
}
export function calendarDate(value: unknown) {
  const date = text(value);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(Date.parse(date))) throw new ActivityResponseError();
  return date;
}
