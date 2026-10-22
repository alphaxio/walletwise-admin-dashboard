import type { UsdKycFixField } from '../constants/usdKycFixFields';
export type WalletAction = 'approve' | 'reject' | 'freeze' | 'unfreeze';
export type UsdKycFixItem = { field: UsdKycFixField; note?: string };
export function walletActionRequest(walletId: string, action: WalletAction, reason: string, items: UsdKycFixItem[] = []) {
  if (!walletId) throw new Error('A wallet ID is required.');
  const requiresReason = action === 'reject' || action === 'freeze';
  const fixItems = action === 'reject' ? items.map(({ field, note }) => ({ field, ...(note?.trim() ? { note: note.trim() } : {}) })) : [];
  // A decline needs a reason or at least one item to fix; a freeze always needs a reason.
  if (requiresReason && !reason.trim() && fixItems.length === 0) throw new Error('A reason is required.');
  return {
    path: `usd/wallets/${encodeURIComponent(walletId)}/${action === 'freeze' || action === 'unfreeze' ? 'freeze' : 'status'}`,
    method: 'patch' as const,
    body: { action, ...(requiresReason && reason.trim() ? {reason:reason.trim()} : {}), ...(fixItems.length ? {items:fixItems} : {}) },
  };
}
