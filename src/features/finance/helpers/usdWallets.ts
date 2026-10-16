import type { FinancialList, FinancialRecord } from '../types';
import { normalizeList } from './records';

/** Keep wallet IDs separate from user IDs; this response supplies no user ID. */
export function normalizeUsdWallets(value: unknown): FinancialList {
  const list = normalizeList(value);
  return {
    ...list,
    records: list.records.map((wallet): FinancialRecord => ({
      ...wallet,
      user: {
        name: [wallet.first_name, wallet.last_name].filter(Boolean).join(' ') || undefined,
        email: wallet.email,
        tag: wallet.user_tag,
        phone: wallet.phone_number,
      },
      createdAt: wallet.created_at,
      updatedAt: wallet.updated_at,
      midenCustomerId: wallet.miden_customer_id,
      midenWalletId: wallet.miden_wallet_id,
      accountNumber: wallet.us_account_number,
      routingNumber: wallet.us_routing_number,
      bankName: wallet.us_bank_name,
      accountType: wallet.us_account_type,
      rejectionReason: wallet.rejection_reason,
      cryptoDepositAddress: wallet.crypto_address,
      restrictionStatus: wallet.restriction_status,
      threatStatus: wallet.threat_status,
    })),
  };
}
