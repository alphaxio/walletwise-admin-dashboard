'use client';
import { useState } from 'react';
import { useFinancialMutation } from './useFinancialData';
import { walletActionRequest, type WalletAction, type UsdKycFixItem } from '../helpers/walletActions';
import type { UsdKycFixField } from '../constants/usdKycFixFields';
export function useUsdWalletActions(walletId: string, status?: string) {
  const [action, setAction] = useState<WalletAction | null>(null);
  const [reason, setReason] = useState('');
  // Items the user must fix, with an optional note shown to them (decline only)
  const [fixNotes, setFixNotes] = useState<Partial<Record<UsdKycFixField, string>>>({});
  const mutation = useFinancialMutation();
  const requiresReason = action === 'reject' || action === 'freeze';
  const fixItems: UsdKycFixItem[] = Object.entries(fixNotes).map(([field, note]) => ({ field: field as UsdKycFixField, note }));
  const canConfirm = !requiresReason || !!reason.trim() || (action === 'reject' && fixItems.length > 0);
  const actions: WalletAction[] = [...(status === 'pending_kyc' ? ['approve','reject'] as const : []), status === 'frozen' ? 'unfreeze' : 'freeze'];
  function reset() { setReason(''); setFixNotes({}); }
  function choose(value: WalletAction) { reset(); setAction(value); }
  function close() { if (!mutation.isPending) {setAction(null);reset();} }
  function toggleFix(field: UsdKycFixField, checked: boolean) {
    setFixNotes(current => { const next = {...current}; if (checked) next[field] = next[field] ?? ''; else delete next[field]; return next; });
  }
  function setFixNote(field: UsdKycFixField, note: string) { setFixNotes(current => ({...current, [field]: note})); }
  function confirm() {
    if (!action || !walletId || !canConfirm || mutation.isPending) return;
    mutation.mutate(walletActionRequest(walletId, action, reason, fixItems), {onSuccess:() => {setAction(null);reset();}});
  }
  return {action,reason,setReason,requiresReason,canConfirm,fixNotes,toggleFix,setFixNote,actions,choose,close,confirm,isSaving:mutation.isPending};
}
