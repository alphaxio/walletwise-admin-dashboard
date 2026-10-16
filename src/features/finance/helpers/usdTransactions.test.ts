import { describe, expect, it } from 'vitest';
import { normalizeUsdTransactions } from './usdTransactions';
import { money, recordId } from './records';
import { columns, metrics } from '../constants/lists';

const response = {
  summary: { totalTransactions: 6, totalVolumeIn: 7.23, totalVolumeOut: 10, totalFees: 9.5, totalCommission: 3.5 },
  pagination: { totalRecords: 6, currentPage: 1, totalPages: 3, limit: 20 },
  transactions: [
    { id: 6, transaction_id: '1791703277351338441', first_name: 'Ada', last_name: 'Example', email: 'ada@example.com', user_tag: 'ada', amount: '5.76', fee: '0.50', commission: '0.50', type: 'credit', category: 'Exchange', date: '2026-10-11T08:21:17+01:00', status: 'success', balance: '35.66', details: { from: 'NGN', to: 'USD', provider_fee: 0.5, sourceAmount: 10000 } },
    { id: 3, transaction_id: '1780438091671670340', fee: '4.00', commission: '1.00', category: 'Enrollment', balance: '0.00', details: { note: 'Wallet Enrollment Fee' } },
  ],
};

describe('USD transaction response adapter', () => {
  it('uses server totals and pagination rather than the visible row count', () => {
    const result = normalizeUsdTransactions(response);
    expect(result.total).toBe(6);
    expect(result.totalPages).toBe(3);
    expect(result.metrics).toEqual(response.summary);
  });
  it('maps flat user identity, nested provider fee, date and reference', () => {
    const record = normalizeUsdTransactions(response).records[0];
    expect(record).toMatchObject({ id: 6, transactionId: '1791703277351338441', user: { name: 'Ada Example', email: 'ada@example.com', tag: 'ada' }, providerFee: 0.5, createdAt: response.transactions[0].date });
    expect(recordId(record)).toBe('6');
    expect(record.details).toEqual(response.transactions[0].details);
  });
  it('preserves zero balances and does not invent missing provider fees', () => {
    const record = normalizeUsdTransactions(response).records[1];
    expect(money(record.balance, 'USD')).toBe('US$0.00');
    expect(money(record.providerFee, 'USD')).toBe('—');
    expect(record.commission).toBe('1.00');
    expect(record.profit).toBeUndefined();
  });
  it('configures table and summary fields from the supplied contract', () => {
    expect(columns['usd/transactions'][0].key).toBe('createdAt');
    expect(columns['usd/transactions'].map(field => field.key)).toContain('transactionId');
    expect(columns['usd/transactions'].map(field => field.key)).toContain('commission');
    expect(metrics['usd/transactions']?.map(field => field.key)).toEqual(Object.keys(response.summary));
  });
});
