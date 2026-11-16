import { format, startOfMonth, subDays } from 'date-fns';
import type { DateRange } from 'react-day-picker';

export function statementRangeLabel(range?: DateRange) {
  if (!range?.from) return 'Select start and end dates';
  const start = format(range.from, 'dd MMM yyyy');
  return range.to ? `${start} – ${format(range.to, 'dd MMM yyyy')}` : `${start} – Select end date`;
}

export function statementPreset(preset: 'week' | 'month' | 'currentMonth'): DateRange {
  const today = new Date();
  return { from: preset === 'currentMonth' ? startOfMonth(today) : subDays(today, preset === 'week' ? 6 : 29), to: today };
}
