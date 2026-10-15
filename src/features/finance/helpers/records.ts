import type { FinancialList, RecordData } from "../types";
export function object(value: unknown): RecordData {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as RecordData)
    : {};
}
export function read(value: unknown, path: string): unknown {
  return path
    .split(".")
    .reduce<unknown>((item, key) => object(item)[key], value);
}
export function display(value: unknown): string {
  return value == null || value === ""
    ? "—"
    : typeof value === "object"
      ? JSON.stringify(value)
      : String(value);
}
export function money(value: unknown, currency: string): string {
  return value == null || value === "" || !Number.isFinite(Number(value))
    ? "—"
    : new Intl.NumberFormat("en-NG", { style: "currency", currency }).format(
        Number(value),
      );
}
export function normalizeList(value: unknown): FinancialList {
  const data = object(value);
  const pagination = object(data.pagination);
  const records = Array.isArray(value)
    ? value
    : (data.records ??
      data.data ??
      data.accounts ??
      data.wallets ??
      data.submissions ??
      data.transactions ??
      data.plans ??
      data.logs);
  if (!Array.isArray(records))
    throw new Error("The API returned an unsupported list response.");
  return {
    records,
    totalPages: Math.max(
      1,
      Number(pagination.totalPages ?? pagination.total_pages ?? data.totalPages ?? 1),
    ),
    total: Number(pagination.totalRecords ?? pagination.total_count ?? data.total ?? records.length),
    metrics: object(data.metrics ?? data.summary),
  };
}
export function recordId(record: RecordData, user = false): string {
  return String(
    (user
      ? (record.userId ?? record.user_id ?? read(record, "user.id"))
      : record.id) ?? "",
  );
}
export function planProgress(start: unknown, end: unknown, now = Date.now()) {
  const first = Date.parse(String(start));
  const last = Date.parse(String(end));
  if (!Number.isFinite(first) || !Number.isFinite(last) || last <= first)
    return null;
  return {
    percent: Math.max(0, Math.min(100, ((now - first) / (last - first)) * 100)),
    days: Math.max(0, Math.ceil((last - now) / 86400000)),
  };
}
export function safeDocumentUrl(value: unknown): string | null {
  if (typeof value !== "string") return null;
  try {
    const url = new URL(value);
    return ["https:", "http:"].includes(url.protocol) ? url.href : null;
  } catch {
    return null;
  }
}
