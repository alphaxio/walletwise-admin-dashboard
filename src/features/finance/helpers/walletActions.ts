export type WalletAction = 'approve' | 'reject' | 'freeze' | 'unfreeze';
export function walletActionRequest(walletId: string, action: WalletAction, reason: string) {
  if (!walletId) throw new Error('A wallet ID is required.');
  const requiresReason = action === 'reject' || action === 'freeze';
  if (requiresReason && !reason.trim()) throw new Error('A reason is required.');
  return {
    path: `usd/wallets/${encodeURIComponent(walletId)}/${action === 'freeze' || action === 'unfreeze' ? 'freeze' : 'status'}`,
    method: 'patch' as const,
    body: { action, ...(requiresReason ? {reason:reason.trim()} : {}) },
  };
}
