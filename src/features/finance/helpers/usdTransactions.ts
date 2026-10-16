import type { FinancialList, FinancialRecord } from '../types';
import { normalizeList, object } from './records';

/** Adapt the USD ledger contract without treating database IDs as transaction references. */
export function normalizeUsdTransactions(value: unknown): FinancialList {
  const list = normalizeList(value);
  return {
    ...list,
    records: list.records.map((record): FinancialRecord => {
      const details = object(record.details);
      return {
        ...record,
        user: {
          id: record.userId ?? record.user_id ?? object(record.user).id,
          name: [record.first_name, record.last_name].filter(Boolean).join(' ') || undefined,
          email: record.email,
          tag: record.user_tag,
        },
        transactionId: record.transaction_id,
        providerFee: details.provider_fee,
        createdAt: record.date,
      };
    }),
  };
}
