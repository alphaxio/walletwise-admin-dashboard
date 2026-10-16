'use client';

import { walletActionLabels } from '../../constants/walletActions';
import { useUsdWalletActions } from '../../hooks/useUsdWalletActions';
import ConfirmAction from '@/components/molecules/ConfirmAction/ConfirmAction';
import ColumnActionDropdown from '@/components/molecules/ColumnActionDropdown/ColumnActionDropdown';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';


export default function UsdWalletActions({ walletId, status, onReview, inline = false }: {
  walletId: string;
  status?: string;
  onReview?: () => void;
  inline?: boolean;
}) {
  const {action,reason,setReason,requiresReason,actions,choose,close,confirm,isSaving} = useUsdWalletActions(walletId,status);
  return <>
    {inline ? <div className="flex flex-wrap gap-3">{actions.map(value => <Button key={value} variant="outline" disabled={!walletId || isSaving} onClick={() => choose(value)}>{walletActionLabels[value]}</Button>)}</div> : <ColumnActionDropdown>
      {onReview && <DropdownMenuItem onSelect={onReview}>Review KYC</DropdownMenuItem>}
      {actions.map(value => <DropdownMenuItem key={value} disabled={!walletId || isSaving} onSelect={() => choose(value)} className={value === 'reject' || value === 'freeze' ? 'text-red-500' : undefined}>{walletActionLabels[value]}</DropdownMenuItem>)}
    </ColumnActionDropdown>}
    <ConfirmAction open={action !== null} setOpen={open => {if (!open) close();}} onCancel={close} onConfirm={confirm} isPending={isSaving} confirmDisabled={!walletId || (requiresReason && !reason.trim())} keepOpenOnConfirm title={action ? walletActionLabels[action] : 'Confirm wallet action'} description={action === 'reject' ? 'Decline this KYC submission? Enter the reason the user needs to address.' : action === 'freeze' ? 'Freeze this USD account? Enter the reason for this restriction.' : action === 'unfreeze' ? 'Remove the freeze from this USD account?' : 'Approve this KYC submission?'}>
      {requiresReason && <label className="space-y-2 text-sm">Reason<Textarea autoFocus required value={reason} disabled={isSaving} onChange={event => setReason(event.target.value)} placeholder={action === 'reject' ? 'Explain why this KYC submission is being declined' : 'Explain why this account is being frozen'} rows={4} /></label>}
    </ConfirmAction>
  </>;
}
