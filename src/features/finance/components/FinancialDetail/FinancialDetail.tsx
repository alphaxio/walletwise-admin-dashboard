'use client';
import StatusBubble from '@/components/atoms/StatusBubble/StatusBubble';
import TableDate from '@/components/atoms/TableDate/TableDate';
import { useFinancialDetail } from '../../hooks/useFinancialDetail';
import Link from 'next/link';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import UsdWalletActions from '../UsdWalletActions/UsdWalletActions';
import UsdKycDetails from '../UsdKycDetails/UsdKycDetails';
import { display, read } from '../../helpers/records';
import type { RecordData, Resource } from '../../types/index';
import { financialDetailFields } from '../../constants/financialDetails';
import RequestState from '../RequestState/RequestState';
export default function FinancialDetail({ resource, id, record, close }: {
    resource: Resource;
    id: string;
    record: RecordData;
    close: () => void;
}) {
    const {detailId,query,action,setAction,reason,setReason,data,kyc,account,plan,actionId,perform,actions,isSaving} = useFinancialDetail(resource,id,record,close);
    return <Dialog open onOpenChange={open => { if (!open && !isSaving)
        close(); }}><DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto"><DialogTitle>{kyc ? 'USD KYC review' : account ? 'USD account details' : plan ? 'Savings plan breakdown' : 'Transaction diagnostics'}</DialogTitle><DialogDescription>Review the record before confirming an administrative action.</DialogDescription>{resource !== 'usd/transactions' && resource !== 'savings/accruals' && <RequestState pending={query.isPending} error={query.isError} retry={() => query.refetch()}/>}{(!query.isPending || resource === 'usd/transactions') && <>{kyc ? <UsdKycDetails data={data} /> : <dl className="grid sm:grid-cols-2 gap-4">{(financialDetailFields[resource] ?? Object.keys(data)).map(key => <div key={key} className="rounded border p-3"><dt className="text-sm text-muted-foreground">{key.replaceAll('.', ' / ')}</dt><dd className="break-all">{['createdAt','submittedAt','startDate','maturityDate','date'].includes(key) ? <TableDate date={String(read(data,key) ?? '')} showWithTime /> : ['status','threatStatus','restrictionStatus'].includes(key) ? <StatusBubble status={typeof read(data,key) === 'string' ? String(read(data,key)) : undefined} /> : display(read(data, key))}</dd></div>)}</dl>}{account && <><h3 className="font-semibold">Linked ACH / Wire beneficiaries</h3><pre className="whitespace-pre-wrap break-all rounded border p-3">{JSON.stringify(data.beneficiaries ?? [], null, 2)}</pre><Link className="underline" href={`/services/usd-accounts/transactions?userId=${encodeURIComponent(id)}`}>View this user’s transactions</Link></>}{resource === 'usd/transactions' && data.status === 'failed' && <><h3>Provider error payload</h3><pre className="whitespace-pre-wrap break-all">{JSON.stringify(data.providerError ?? data.provider_error ?? null, null, 2)}</pre></>}
 {kyc && !query.isError && <UsdWalletActions walletId={detailId} status={typeof data.status === 'string' ? data.status : undefined} inline />}
 <div className="flex flex-wrap gap-3">{!query.isError && actions.map(item => <Button key={item} variant="outline" disabled={!actionId || isSaving || (item === 'payout' && !(data.payoutEligible === true || (data.status === 'active' && Number.isFinite(Date.parse(String(data.maturityDate))) && Date.parse(String(data.maturityDate)) <= Date.now())))} onClick={() => { setAction(item); setReason(''); }}>{item === 'active' ? 'Unfreeze' : item === 'frozen' ? 'Freeze' : item.replaceAll('-', ' ')}</Button>)}</div>
 {action && <section className="rounded border p-4 space-y-3"><p>Confirm {action.replaceAll('-', ' ')} for this record?</p>{action === 'reject' && <label className="block">Rejection reason<select className="block border rounded p-2 bg-background w-full" value={reason} onChange={event => setReason(event.target.value)}><option value="">Select a reason</option>{['Expired ID', 'Blurry document', 'Address does not match name', 'Custom text'].map(item => <option key={item}>{item}</option>)}</select></label>}{(action === 'force-liquidate' || action === 'Custom text' || (action === 'reject' && !['Expired ID', 'Blurry document', 'Address does not match name'].includes(reason))) && <Input aria-label="Action reason" placeholder="Enter a reason" value={reason === 'Custom text' ? '' : reason} onChange={event => setReason(event.target.value)}/>}<p className="text-sm text-muted-foreground">{action === 'payout' ? 'Maturity eligibility and previous payouts are checked before funds are released.' : action === 'force-liquidate' ? 'This returns the principal to the user’s wallet according to the configured penalty rules.' : 'This action is recorded in the audit log and may notify the user.'}</p><Button disabled={isSaving || ((action === 'reject' || action === 'force-liquidate') && (!reason.trim() || reason === 'Custom text'))} onClick={perform}>{isSaving ? 'Saving…' : 'Confirm'}</Button><Button variant="ghost" disabled={isSaving} onClick={() => setAction('')}>Cancel</Button></section>}</>}
 </DialogContent></Dialog>;
}
