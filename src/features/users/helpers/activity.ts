import { addDays, addMonths, endOfMonth, format, parseISO, startOfWeek } from 'date-fns';
import type { ActivityPeriod, ActivityResponse } from '../types/activity';
export { exportActivity } from './activityExport';

export const formatActivityMoney = (minor: number) => new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 2 }).format(minor / 100);
export const formatActivityTime = (value: string) => new Intl.DateTimeFormat('en-GB', { timeZone: 'Africa/Lagos', day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date(value));
export const formatAxisMoney = (value: number) => `₦${value >= 1000 ? `${value / 1000}k` : value}`;
export const formatTooltipMoney = (value: number | string | Array<number | string>, name?: string | number) => `${name ? `${name}: ` : ''}${formatActivityMoney(Number(value) * 100)}`;

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
export function lagosToday() {
  const parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Africa/Lagos', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date());
  const value = (type: string) => parts.find(part => part.type === type)!.value;
  return `${value('year')}-${value('month')}-${value('day')}`;
}
export function activityComparisonLabels(comparison: ActivityResponse['comparison'] | undefined, period: ActivityPeriod) {
  const suffix = period === 'daily' ? 'vs previous day' : period === 'weekly' ? 'vs previous week' : 'vs previous month';
  const label = (value: number | null | undefined, percentage: boolean) => value == null ? 'No previous-period comparison' : `${value >= 0 ? '+' : ''}${percentage ? value.toFixed(1) : value}${percentage ? '%' : ''} ${suffix}`;
  return { received: label(comparison?.received, true), spent: label(comparison?.spent, true), transactions: label(comparison?.transactions, false), sessions: label(comparison?.sessions, false) };
}
