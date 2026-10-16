'use client';
import { useState } from 'react';
import { useFinancialMutation } from './useFinancialData';
import { walletActionRequest, type WalletAction } from '../helpers/walletActions';
export function useUsdWalletActions(walletId: string, status?: string) {
  const [action, setAction] = useState<WalletAction | null>(null);
  const [reason, setReason] = useState('');
  const mutation = useFinancialMutation();
  const requiresReason = action === 'reject' || action === 'freeze';
  const actions: WalletAction[] = [...(status === 'pending_kyc' ? ['approve','reject'] as const : []), status === 'frozen' ? 'unfreeze' : 'freeze'];
  function choose(value: WalletAction) { setReason(''); setAction(value); }
  function close() { if (!mutation.isPending) {setAction(null);setReason('');} }
  function confirm() {
    if (!action || !walletId || (requiresReason && !reason.trim()) || mutation.isPending) return;
    mutation.mutate(walletActionRequest(walletId, action, reason), {onSuccess:() => {setAction(null);setReason('');}});
  }
  return {action,reason,setReason,requiresReason,actions,choose,close,confirm,isSaving:mutation.isPending};
}
