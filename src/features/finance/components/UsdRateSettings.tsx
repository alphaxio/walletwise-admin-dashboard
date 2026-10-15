'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import TableDate from '@/components/atoms/TableDate/TableDate';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useFinancialMutation, useFinancialRecord } from '../hooks/useFinancialData';
import { display, money } from '../helpers/records';
import { usdRateRows } from '../constants/usdRates';
import RequestState from './RequestState';

export default function UsdRateSettings() {
  const query = useFinancialRecord('usd/rates');
  const mutation = useFinancialMutation();
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [confirm, setConfirm] = useState(false);
  const data = query.data;
  const value = (key: string) => draft[key] ?? (data?.[key] == null ? '' : String(data[key]));
  const changed = usdRateRows.filter(row => draft[row.key] !== undefined && value(row.key) !== String(data?.[row.key]));
  const valid = changed.length > 0 && changed.every(row => value(row.key).trim() !== '' && Number.isFinite(Number(value(row.key))) && Number(value(row.key)) >= 0);

  return <div className="space-y-6">
    <RequestState pending={query.isPending} error={query.isError} retry={() => query.refetch()} />
    {data && !query.isError && <form className="space-y-5" onSubmit={event => { event.preventDefault(); if (valid) setConfirm(true); }}>
      <div className="rounded border p-4 flex flex-wrap gap-6">
        <p>Currency: <strong>{display(data.currency)}</strong></p>
        <div>Last updated: <TableDate date={String(data.updated_at ?? '')} showWithTime /></div>
      </div>
      <div className="overflow-x-auto rounded border"><Table>
        <TableHeader><TableRow><TableHead>Rate / fee</TableHead><TableHead>Customer value</TableHead><TableHead>Provider value</TableHead></TableRow></TableHeader>
        <TableBody>{usdRateRows.map(row => <TableRow key={row.key}>
          <TableCell><label htmlFor={`usd-${row.key}`}>{row.label} ({row.currency}{row.rate ? ' / USD' : ''})</label></TableCell>
          <TableCell><Input id={`usd-${row.key}`} type="number" min="0" step={row.rate ? '0.0001' : '0.01'} required value={value(row.key)} disabled={mutation.isPending} onChange={event => { setDraft(previous => ({...previous, [row.key]: event.target.value})); setConfirm(false); }} /></TableCell>
          <TableCell>{row.rate && data[row.providerKey] != null ? new Intl.NumberFormat('en-NG', {style:'currency',currency:row.currency,minimumFractionDigits:4,maximumFractionDigits:4}).format(Number(data[row.providerKey])) : money(data[row.providerKey], row.currency)}</TableCell>
        </TableRow>)}</TableBody>
      </Table></div>
      <Button disabled={!valid || mutation.isPending} type="submit">Review changes</Button>
      {confirm && <section className="rounded border p-4 space-y-3">
        <p>Confirm these USD rate and fee changes?</p>
        <ul>{changed.map(row => <li key={row.key}>{row.label}: {display(data[row.key])} → {value(row.key)} {row.currency}</li>)}</ul>
        <div className="flex gap-3"><Button type="button" disabled={!valid || mutation.isPending} onClick={() => mutation.mutate({path:'usd/rates',method:'put',body:Object.fromEntries(changed.map(row => [row.key, Number(value(row.key))]))}, {onSuccess:() => {setDraft({});setConfirm(false);}})}>{mutation.isPending ? 'Saving…' : 'Confirm and save'}</Button><Button type="button" variant="ghost" disabled={mutation.isPending} onClick={() => setConfirm(false)}>Cancel</Button></div>
      </section>}
    </form>}
  </div>;
}
