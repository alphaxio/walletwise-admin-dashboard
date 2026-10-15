'use client';

import { useState } from 'react';
import ConfirmAction from '@/components/molecules/ConfirmAction/ConfirmAction';
import ColumnActionDropdown from '@/components/molecules/ColumnActionDropdown/ColumnActionDropdown';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useFinancialMutation } from '../hooks/useFinancialData';
import { walletActionRequest, type WalletAction } from '../helpers/walletActions';

const labels: Record<WalletAction, string> = {approve:'Approve KYC',reject:'Decline KYC',freeze:'Freeze account',unfreeze:'Unfreeze account'};
export default function UsdWalletActions({ walletId, status, onReview, inline = false }: {
  walletId: string;
  status?: string;
  onReview?: () => void;
  inline?: boolean;
}) {
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
  return <>
    {inline ? <div className="flex flex-wrap gap-3">{actions.map(value => <Button key={value} variant="outline" disabled={!walletId || mutation.isPending} onClick={() => choose(value)}>{labels[value]}</Button>)}</div> : <ColumnActionDropdown>
      {onReview && <DropdownMenuItem onSelect={onReview}>Review KYC</DropdownMenuItem>}
      {actions.map(value => <DropdownMenuItem key={value} disabled={!walletId || mutation.isPending} onSelect={() => choose(value)} className={value === 'reject' || value === 'freeze' ? 'text-red-500' : undefined}>{labels[value]}</DropdownMenuItem>)}
    </ColumnActionDropdown>}
    <ConfirmAction open={action !== null} setOpen={open => {if (!open) close();}} onCancel={close} onConfirm={confirm} isPending={mutation.isPending} confirmDisabled={!walletId || (requiresReason && !reason.trim())} keepOpenOnConfirm title={action ? labels[action] : 'Confirm wallet action'} description={action === 'reject' ? 'Decline this KYC submission? Enter the reason the user needs to address.' : action === 'freeze' ? 'Freeze this USD account? Enter the reason for this restriction.' : action === 'unfreeze' ? 'Remove the freeze from this USD account?' : 'Approve this KYC submission?'}>
      {requiresReason && <label className="space-y-2 text-sm">Reason<Textarea autoFocus required value={reason} disabled={mutation.isPending} onChange={event => setReason(event.target.value)} placeholder={action === 'reject' ? 'Explain why this KYC submission is being declined' : 'Explain why this account is being frozen'} rows={4} /></label>}
    </ConfirmAction>
  </>;
}
