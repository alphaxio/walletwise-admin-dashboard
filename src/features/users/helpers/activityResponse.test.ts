import { describe, expect, it } from 'vitest';
import { activityPayload, emptyActivityPayload } from '../testFixtures/activity';
import { ActivityResponseError, normalizeActivityResponse } from './activityResponse';

describe('backend activity response adapter', () => {
  it('maps the supplied empty response with null sessions, real context keys and zero amounts', () => {
    const response = normalizeActivityResponse(emptyActivityPayload(), 'daily');
    expect(response.summary).toEqual({ received: 0, spent: 0, transactions: 0, failed: 0, pending: 0, sessions: null });
    expect(response.context).toMatchObject({ walletBalanceMinor: 13641444, lastActiveAt: '2026-10-18T11:17:12+01:00', device: 'iPhone13,3 · IOS 26.5.2', tier: 'Tier 3', kyc: 'verified', streak: '0 days', checkInProgress: '0 of 1 days checked in' });
    expect(response.buckets).toHaveLength(24);
    expect(response.buckets[0]).toEqual({ label: '00:00', received: 0, spent: 0 });
    expect(response.services).toHaveLength(7);
    expect(response.records).toEqual([]);
    expect(response.recordsTruncated).toBe(false);
    expect(response.range).toEqual({ start: '2026-11-19', end: '2026-11-20' });
    expect(response.comparison.received).toBeNull();
    expect(response.comparison.sessions).toBeNull();
  });
  it('uses server aggregates rather than rebuilding totals from truncated records', () => {
    const response = normalizeActivityResponse(activityPayload(), 'daily');
    expect(response.summary).toEqual({ received: 12000000, spent: 8750000, transactions: 7, failed: 1, pending: 0, sessions: 3 });
    expect(response.records).toHaveLength(3);
    expect(response.recordsTruncated).toBe(true);
    expect(response.buckets[9]).toEqual({ label: '09:00', received: 120000, spent: 0 });
    expect(response.services[0]).toMatchObject({ amountMinor: 8750000, sharePercent: 100 });
    expect(response.context?.walletBalanceMinor).toBe(0);
    expect(response.records[2].amountMinor).toBeNull();
    expect(response.comparison).toMatchObject({ received: 20, transactions: 2, sessions: 1 });
  });
  it('supports absent optional context/comparisons without fabricating values', () => {
    const payload = emptyActivityPayload();
    const response = normalizeActivityResponse({ ...payload, data: { ...payload.data, context: null, previousSummary: null } }, 'daily');
    expect(response.context).toBeNull();
    expect(response.comparison.transactions).toBeNull();
  });
  it('rejects malformed responses, unsafe money, and mismatched periods', () => {
    expect(() => normalizeActivityResponse({ data: {} }, 'daily')).toThrow(ActivityResponseError);
    expect(() => normalizeActivityResponse(emptyActivityPayload(), 'weekly')).toThrow(ActivityResponseError);
    const payload = activityPayload();
    payload.data.summary.receivedMinor = Number.NaN;
    expect(() => normalizeActivityResponse(payload, 'daily')).toThrow(ActivityResponseError);
    payload.data.summary.receivedMinor = 0.5;
    expect(() => normalizeActivityResponse(payload, 'daily')).toThrow(ActivityResponseError);
  });
  it('preserves explicit backend failures', () => {
    expect(() => normalizeActivityResponse({ success: false, message: 'Access denied', data: null }, 'daily')).toThrow('Access denied');
  });
});
