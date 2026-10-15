'use client';

import { useUsdRateSettings } from '../../hooks/useUsdRateSettings';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import TableDate from '@/components/atoms/TableDate/TableDate';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { display, money } from '../../helpers/records';
import { usdRateRows } from '../../constants/usdRates';
import RequestState from '../RequestState/RequestState';

export default function UsdRateSettings() {
  const {query,data,setDraft,confirm,setConfirm,value,changed,valid,save,isSaving} = useUsdRateSettings();

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
          <TableCell><Input id={`usd-${row.key}`} type="number" min="0" step={row.rate ? '0.0001' : '0.01'} required value={value(row.key)} disabled={isSaving} onChange={event => { setDraft(previous => ({...previous, [row.key]: event.target.value})); setConfirm(false); }} /></TableCell>
          <TableCell>{row.rate && data[row.providerKey] != null ? new Intl.NumberFormat('en-NG', {style:'currency',currency:row.currency,minimumFractionDigits:4,maximumFractionDigits:4}).format(Number(data[row.providerKey])) : money(data[row.providerKey], row.currency)}</TableCell>
        </TableRow>)}</TableBody>
      </Table></div>
      <Button disabled={!valid || isSaving} type="submit">Review changes</Button>
      {confirm && <section className="rounded border p-4 space-y-3">
        <p>Confirm these USD rate and fee changes?</p>
        <ul>{changed.map(row => <li key={row.key}>{row.label}: {display(data[row.key])} → {value(row.key)} {row.currency}</li>)}</ul>
        <div className="flex gap-3"><Button type="button" disabled={!valid || isSaving} onClick={save}>{isSaving ? 'Saving…' : 'Confirm and save'}</Button><Button type="button" variant="ghost" disabled={isSaving} onClick={() => setConfirm(false)}>Cancel</Button></div>
      </section>}
    </form>}
  </div>;
}
