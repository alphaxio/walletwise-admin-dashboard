import { addDays, addMonths, endOfMonth, format, parseISO, startOfWeek } from 'date-fns';
import type { ActivityPeriod, UserActivityRecord } from '../types/activity';
import { ACTIVITY_SERVICES, SERVICE_COLORS } from '../constants/activity';

export const formatActivityMoney = (minor: number) => new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 2 }).format(minor / 100);
export const formatActivityTime = (value: string) => new Intl.DateTimeFormat('en-GB', { timeZone: 'Africa/Lagos', day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date(value));
export const formatAxisMoney = (value: number) => `₦${value >= 1000 ? `${value / 1000}k` : value}`;
export const formatTooltipMoney = (value: number | string | Array<number | string>) => formatActivityMoney(Number(value) * 100);

export function activityRange(date: string, period: ActivityPeriod) {
  const anchor = parseISO(date);
  const start = period === 'weekly' ? startOfWeek(anchor, { weekStartsOn: 1 }) : period === 'monthly' ? new Date(anchor.getFullYear(), anchor.getMonth(), 1) : anchor;
  const end = period === 'weekly' ? addDays(start, 7) : period === 'monthly' ? addDays(endOfMonth(start), 1) : addDays(start, 1);
  return { start: format(start, 'yyyy-MM-dd'), end: format(end, 'yyyy-MM-dd') };
}
export function shiftActivityDate(date: string, period: ActivityPeriod, direction: number) {
  const parsed = parseISO(date);
  return format(period === 'monthly' ? addMonths(parsed, direction) : addDays(parsed, direction * (period === 'weekly' ? 7 : 1)), 'yyyy-MM-dd');
}
export function selectActivity(records: UserActivityRecord[], date: string, period: ActivityPeriod) {
  const range = activityRange(date, period);
  return records.filter(row => row.occurredAt.slice(0, 10) >= range.start && row.occurredAt.slice(0, 10) < range.end).sort((a, b) => b.occurredAt.localeCompare(a.occurredAt));
}
export function summarizeActivity(records: UserActivityRecord[]) {
  const successful = records.filter(row => row.status === 'success');
  const sum = (kind: string) => successful.filter(row => row.kind === kind).reduce((total, row) => total + (row.amountMinor ?? 0), 0);
  const transactions = records.filter(row => row.kind === 'received' || row.kind === 'spent');
  return { received: sum('received'), spent: sum('spent'), transactions: transactions.length, failed: transactions.filter(row => row.status === 'failed').length, sessions: successful.filter(row => row.kind === 'session').length };
}
export function activityBuckets(records: UserActivityRecord[], date: string, period: ActivityPeriod) {
  const range = activityRange(date, period);
  const count = period === 'daily' ? 24 : Math.round((parseISO(range.end).getTime() - parseISO(range.start).getTime()) / 86400000);
  return Array.from({ length: count }, (_, index) => {
    const key = period === 'daily' ? String(index).padStart(2, '0') : format(addDays(parseISO(range.start), index), 'yyyy-MM-dd');
    const rows = records.filter(row => period === 'daily' ? row.occurredAt.slice(11, 13) === key : row.occurredAt.slice(0, 10) === key);
    const totals = summarizeActivity(rows);
    return { label: period === 'daily' ? `${key}:00` : format(parseISO(key), period === 'weekly' ? 'EEE d' : 'd MMM'), received: totals.received / 100, spent: totals.spent / 100 };
  });
}
export function activityServices(records: UserActivityRecord[]) {
  const total = summarizeActivity(records).spent;
  return ACTIVITY_SERVICES.map((service, index) => ({ service, color: SERVICE_COLORS[index], amountMinor: records.filter(row => row.service === service && row.kind === 'spent' && row.status === 'success').reduce((sum, row) => sum + (row.amountMinor ?? 0), 0) })).map(service => ({ ...service, sharePercent: total ? service.amountMinor / total * 100 : 0 }));
}
export function exportActivity(records: UserActivityRecord[], date: string) {
  const rows = [['Date and time', 'Activity', 'Amount (NGN)', 'Type', 'Channel', 'Service', 'Status'], ...records.map(row => [row.occurredAt, row.description, row.amountMinor === null ? '' : (row.amountMinor / 100).toFixed(2), row.kind, row.channel, row.service, row.status])];
  const csv = rows.map(row => row.map(value => `"${String(value).replace(/"/g, '""')}"`).join(',')).join('\r\n');
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = `demo-user-activity-${date}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export function compareActivity(current: ReturnType<typeof summarizeActivity>, previousRows: UserActivityRecord[], period: ActivityPeriod) {
  const previous = summarizeActivity(previousRows);
  const suffix = period === 'daily' ? 'vs previous day' : period === 'weekly' ? 'vs previous week' : 'vs previous month';
  const percent = (value: number, old: number) => !previousRows.length || old === 0 ? 'No previous-period comparison' : `${value >= old ? '+' : ''}${((value - old) / old * 100).toFixed(1)}% ${suffix}`;
  const count = (value: number, old: number) => !previousRows.length ? 'No previous-period comparison' : `${value >= old ? '+' : ''}${value - old} ${suffix}`;
  return { received: percent(current.received, previous.received), spent: percent(current.spent, previous.spent), transactions: count(current.transactions, previous.transactions), sessions: count(current.sessions, previous.sessions) };
}
