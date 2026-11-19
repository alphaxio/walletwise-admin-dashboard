import { afterEach, describe, expect, it, vi } from 'vitest';
import { activityRange, lagosToday, shiftActivityDate } from './activity';
import { activityCsv } from './activityExport';
import { normalizeActivityResponse } from './activityResponse';
import { activityPayload } from '../testFixtures/activity';

afterEach(() => vi.useRealTimers());
describe('user activity presentation', () => {
  it('uses Monday-based weeks, exclusive bounds, and leap-year month lengths', () => {
    expect(activityRange('2026-11-12', 'weekly')).toEqual({ start: '2026-11-09', end: '2026-11-16' });
    expect(activityRange('2024-02-12', 'monthly')).toEqual({ start: '2024-02-01', end: '2024-03-01' });
    expect(shiftActivityDate('2026-01-31', 'monthly', 1)).toBe('2026-02-28');
    expect(shiftActivityDate('2026-11-12', 'weekly', -1)).toBe('2026-11-05');
  });
  it('uses the next calendar day once it is midnight in Lagos', () => {
    vi.useFakeTimers(); vi.setSystemTime(new Date('2026-11-11T23:01:00Z'));
    expect(lagosToday()).toBe('2026-11-12');
  });
  it('exports kobo as naira, preserves nulls, and neutralizes spreadsheet formulas', () => {
    const rows = normalizeActivityResponse(activityPayload(), 'daily').records;
    rows[0].description = '=1+1';
    const csv = activityCsv(rows);
    expect(csv).toContain('"75000.00"');
    expect(csv).toContain('"\'=1+1"');
    expect(csv).toContain('"Logged in","","session"');
  });
});
