import { describe, expect, it } from 'vitest';
import { DEMO_ACTIVITY } from '../constants/activity';
import { activityBuckets, activityRange, activityServices, selectActivity, shiftActivityDate, summarizeActivity } from './activity';

describe('user activity reporting', () => {
  it('uses Monday-based weeks, exclusive bounds, and leap-year month lengths', () => {
    expect(activityRange('2026-11-12', 'weekly')).toEqual({ start: '2026-11-09', end: '2026-11-16' });
    expect(activityRange('2024-02-12', 'monthly')).toEqual({ start: '2024-02-01', end: '2024-03-01' });
    expect(shiftActivityDate('2026-01-31', 'monthly', 1)).toBe('2026-02-28');
    expect(shiftActivityDate('2026-11-12', 'weekly', -1)).toBe('2026-11-05');
  });
  it('includes failed attempts without inflating successful monetary totals', () => {
    const rows = selectActivity(DEMO_ACTIVITY, '2026-11-12', 'daily');
    expect(rows).toHaveLength(11);
    expect(summarizeActivity(rows)).toEqual({ received: 12000000, spent: 8750000, transactions: 7, failed: 1, sessions: 3 });
    expect(rows[0].id).toBe('demo-1');
  });
  it('keeps chart buckets and service spend consistent with full-period totals', () => {
    for (const period of ['daily', 'weekly', 'monthly'] as const) {
      const rows = selectActivity(DEMO_ACTIVITY, '2026-11-12', period);
      const totals = summarizeActivity(rows);
      const buckets = activityBuckets(rows, '2026-11-12', period);
      expect(buckets).toHaveLength(period === 'daily' ? 24 : period === 'weekly' ? 7 : 30);
      expect(buckets.reduce((sum, bucket) => sum + bucket.spent * 100, 0)).toBe(totals.spent);
      expect(buckets.reduce((sum, bucket) => sum + bucket.received * 100, 0)).toBe(totals.received);
      expect(activityServices(rows).reduce((sum, service) => sum + service.amountMinor, 0)).toBe(totals.spent);
    }
  });
  it('returns a zero summary and zero-filled buckets for an empty period', () => {
    const rows = selectActivity(DEMO_ACTIVITY, '2026-12-01', 'daily');
    expect(rows).toEqual([]);
    expect(summarizeActivity(rows).spent).toBe(0);
    expect(activityBuckets(rows, '2026-12-01', 'daily').every(row => row.received === 0 && row.spent === 0)).toBe(true);
  });
});
