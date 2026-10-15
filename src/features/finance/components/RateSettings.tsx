'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useFinancialMutation, useFinancialRecord } from '../hooks/useFinancialData';
import { display } from '../helpers/records';
import RequestState from './RequestState';
import UsdRateSettings from './UsdRateSettings';

const savingsFields = [
  ['flexApy', 'Flex Save APY (%)'],
  ['goalApy', 'Goal Save APY (%)'],
  ['lock30To60Apy', 'Lock: 30–60 days APY (%)'],
  ['lock61To90Apy', 'Lock: 61–90 days APY (%)'],
  ['lock91To180Apy', 'Lock: 91–180 days APY (%)'],
  ['lock181To365Apy', 'Lock: 181–365 days APY (%)'],
  ['earlyLiquidationPenalty', 'Early liquidation penalty (% of accrued interest)'],
];

function SavingsRateSettings() {
  const query = useFinancialRecord('savings/rates');
  const mutation = useFinancialMutation();
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [confirm, setConfirm] = useState(false);
  const value = (key: string) => draft[key] ?? (query.data?.[key] == null ? '' : String(query.data[key]));
  const valid = savingsFields.every(([key]) => value(key).trim() !== '' && Number.isFinite(Number(value(key))) && Number(value(key)) >= 0 && Number(value(key)) <= 100);

  return <div className="space-y-6">
    <RequestState pending={query.isPending} error={query.isError} retry={() => query.refetch()} />
    {query.data && !query.isError && <form className="space-y-6" onSubmit={event => { event.preventDefault(); if (valid) setConfirm(true); }}>
      <div className="grid md:grid-cols-2 gap-4">{savingsFields.map(([key, label]) => <label key={key} className="space-y-2">{label}
        <Input type="number" required min={0} max={100} step="0.01" value={value(key)} disabled={mutation.isPending} onChange={event => { setDraft(previous => ({...previous, [key]: event.target.value})); setConfirm(false); }} />
      </label>)}</div>
      <label className="block">Early liquidation rule<select className="border rounded bg-background p-2 block" value={draft.penaltyMode ?? String(query.data.penaltyMode ?? 'percentage')} onChange={event => {setDraft(previous => ({...previous,penaltyMode:event.target.value}));setConfirm(false);}}><option value="percentage">Percentage of accrued interest</option><option value="forfeit_interest">Forfeit all accrued interest</option></select></label>
      <Button type="submit" disabled={!valid || mutation.isPending || Object.keys(draft).length === 0}>Review changes</Button>
      {confirm && <div className="rounded border p-4 space-y-3">
        <p>Confirm these rate changes? The audit log records the administrator and previous and updated values.</p>
        <ul>{savingsFields.filter(([key]) => draft[key] !== undefined).map(([key,label]) => <li key={key}>{label}: {display(query.data?.[key])} → {value(key)}</li>)}{draft.penaltyMode && <li>Penalty rule: {display(query.data.penaltyMode)} → {draft.penaltyMode}</li>}</ul>
        <Button disabled={mutation.isPending} type="button" onClick={() => mutation.mutate({path:'savings/rates',method:'put',body:{...Object.fromEntries(savingsFields.map(([key]) => [key,Number(value(key))])),penaltyMode:draft.penaltyMode ?? query.data?.penaltyMode ?? 'percentage'}}, {onSuccess:() => {setDraft({});setConfirm(false);}})}>{mutation.isPending ? 'Saving…' : 'Confirm and save'}</Button>
        <Button type="button" variant="ghost" onClick={() => setConfirm(false)}>Cancel</Button>
      </div>}
    </form>}
    {query.data?.auditLog != null && <section className="space-y-3"><h3 className="font-semibold">Rate change audit log</h3><pre className="rounded border p-4 whitespace-pre-wrap break-all">{JSON.stringify(query.data.auditLog,null,2)}</pre></section>}
  </div>;
}

export default function RateSettings({type}: {type: 'usd' | 'savings'}) {
  return type === 'usd' ? <UsdRateSettings /> : <SavingsRateSettings />;
}
