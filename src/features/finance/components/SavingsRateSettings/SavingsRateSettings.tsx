'use client';
import { useSavingsRateSettings } from '../../hooks/useSavingsRateSettings';
import { savingsFields } from '../../constants/savingsRates';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { display } from '../../helpers/records';
import RequestState from '../RequestState/RequestState';
export default function SavingsRateSettings() {
  const {query,draft,setDraft,confirm,setConfirm,value,valid,save,isSaving} = useSavingsRateSettings();

  return <div className="space-y-6">
    <RequestState pending={query.isPending} error={query.isError} retry={() => query.refetch()} />
    {query.data && !query.isError && <form className="space-y-6" onSubmit={event => { event.preventDefault(); if (valid) setConfirm(true); }}>
      <div className="grid md:grid-cols-2 gap-4">{savingsFields.map(([key, label]) => <label key={key} className="space-y-2">{label}
        <Input type="number" required min={0} max={100} step="0.01" value={value(key)} disabled={isSaving} onChange={event => { setDraft(previous => ({...previous, [key]: event.target.value})); setConfirm(false); }} />
      </label>)}</div>
      <label className="block">Early liquidation rule<select className="border rounded bg-background p-2 block" value={draft.penaltyMode ?? String(query.data.penaltyMode ?? 'percentage')} onChange={event => {setDraft(previous => ({...previous,penaltyMode:event.target.value}));setConfirm(false);}}><option value="percentage">Percentage of accrued interest</option><option value="forfeit_interest">Forfeit all accrued interest</option></select></label>
      <Button type="submit" disabled={!valid || isSaving || Object.keys(draft).length === 0}>Review changes</Button>
      {confirm && <div className="rounded border p-4 space-y-3">
        <p>Confirm these rate changes? The audit log records the administrator and previous and updated values.</p>
        <ul>{savingsFields.filter(([key]) => draft[key] !== undefined).map(([key,label]) => <li key={key}>{label}: {display(query.data?.[key])} → {value(key)}</li>)}{draft.penaltyMode && <li>Penalty rule: {display(query.data.penaltyMode)} → {draft.penaltyMode}</li>}</ul>
        <Button disabled={isSaving} type="button" onClick={save}>{isSaving ? 'Saving…' : 'Confirm and save'}</Button>
        <Button type="button" variant="ghost" onClick={() => setConfirm(false)}>Cancel</Button>
      </div>}
    </form>}
    {query.data?.auditLog != null && <section className="space-y-3"><h3 className="font-semibold">Rate change audit log</h3><pre className="rounded border p-4 whitespace-pre-wrap break-all">{JSON.stringify(query.data.auditLog,null,2)}</pre></section>}
  </div>;
}

