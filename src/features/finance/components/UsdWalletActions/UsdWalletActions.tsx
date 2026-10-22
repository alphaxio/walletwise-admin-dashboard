'use client';

import { walletActionLabels } from '../../constants/walletActions';
import { usdKycFixFields } from '../../constants/usdKycFixFields';
import { useUsdWalletActions } from '../../hooks/useUsdWalletActions';
import ConfirmAction from '@/components/molecules/ConfirmAction/ConfirmAction';
import ColumnActionDropdown from '@/components/molecules/ColumnActionDropdown/ColumnActionDropdown';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';


export default function UsdWalletActions({ walletId, status, onReview, inline = false }: {
  walletId: string;
  status?: string;
  onReview?: () => void;
  inline?: boolean;
}) {
  const {action,reason,setReason,requiresReason,canConfirm,fixNotes,toggleFix,setFixNote,actions,choose,close,confirm,isSaving} = useUsdWalletActions(walletId,status);
  return <>
    {inline ? <div className="flex flex-wrap gap-3">{actions.map(value => <Button key={value} variant="outline" disabled={!walletId || isSaving} onClick={() => choose(value)}>{walletActionLabels[value]}</Button>)}</div> : <ColumnActionDropdown>
      {onReview && <DropdownMenuItem onSelect={onReview}>Review KYC</DropdownMenuItem>}
      {actions.map(value => <DropdownMenuItem key={value} disabled={!walletId || isSaving} onSelect={() => choose(value)} className={value === 'reject' || value === 'freeze' ? 'text-red-500' : undefined}>{walletActionLabels[value]}</DropdownMenuItem>)}
    </ColumnActionDropdown>}
    <ConfirmAction open={action !== null} setOpen={open => {if (!open) close();}} onCancel={close} onConfirm={confirm} isPending={isSaving} confirmDisabled={!walletId || !canConfirm} keepOpenOnConfirm title={action ? walletActionLabels[action] : 'Confirm wallet action'} description={action === 'reject' ? 'Decline this KYC submission? Tick what the user must fix so the app asks for only those items, or enter a reason.' : action === 'freeze' ? 'Freeze this USD account? Enter the reason for this restriction.' : action === 'unfreeze' ? 'Remove the freeze from this USD account?' : 'Approve this KYC submission? Users not yet registered with Miden are sent to Miden for final verification.'}>
      {action === 'reject' && <fieldset className="space-y-2 text-sm" disabled={isSaving}>
        <legend className="font-medium mb-1">Items the user must fix</legend>
        <div className="max-h-64 overflow-y-auto space-y-2 pr-1">{usdKycFixFields.map(({field,label}) => {
          const checked = field in fixNotes;
          return <div key={field} className="space-y-1">
            <label className="flex items-center gap-2 cursor-pointer"><Checkbox checked={checked} onCheckedChange={value => toggleFix(field, value === true)} aria-label={label} />{label}</label>
            {checked && <Input aria-label={`Note for ${label}`} value={fixNotes[field] ?? ''} maxLength={300} onChange={event => setFixNote(field, event.target.value)} placeholder="Note for the user (optional)" className="ml-6 w-[calc(100%-1.5rem)]" />}
          </div>;
        })}</div>
      </fieldset>}
      {requiresReason && <label className="space-y-2 text-sm">Reason<Textarea autoFocus={action !== 'reject'} required={action !== 'reject'} value={reason} disabled={isSaving} onChange={event => setReason(event.target.value)} placeholder={action === 'reject' ? 'Message shown above the list (optional when items are ticked)' : 'Explain why this account is being frozen'} rows={action === 'reject' ? 2 : 4} /></label>}
    </ConfirmAction>
  </>;
}
