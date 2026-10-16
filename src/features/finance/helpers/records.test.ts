import { describe, expect, it } from 'vitest';
import { normalizeList, planProgress, safeDocumentUrl, money, recordId } from './records';
describe('financial API contracts', () => {
    it('preserves server pagination and account metrics', () => { expect(normalizeList({ accounts: [{ userId: 'u1' }], pagination: { total_pages: 3, total_count: 55 }, metrics: { totalBalance: 12 } })).toEqual({ records: [{ userId: 'u1' }], totalPages: 3, total: 55, metrics: { totalBalance: 12 } }); });
    it('rejects malformed responses rather than showing empty data', () => { expect(() => normalizeList({ unexpected: [] })).toThrow(); });
    it('uses the user identifier for USD actions', () => { expect(recordId({ id: 'wallet1', user: { id: 'u1' } }, true)).toBe('u1'); });
    it('does not show missing balances as zero', () => { expect(money(undefined, 'USD')).toBe('—'); });
    it('clamps maturity progress and rejects invalid schedules', () => { expect(planProgress('2026-01-01', '2026-01-11', Date.parse('2026-01-06'))).toEqual({ percent: 50, days: 5 }); expect(planProgress('2026-01-01', '2026-01-11', Date.parse('2026-01-20'))).toEqual({ percent: 100, days: 0 }); expect(planProgress('bad', 'bad')).toBeNull(); });
    it('rejects executable document URLs', () => { expect(safeDocumentUrl('javascript:alert(1)')).toBeNull(); expect(safeDocumentUrl('https://example.com/id.pdf')).toBe('https://example.com/id.pdf'); });
});
