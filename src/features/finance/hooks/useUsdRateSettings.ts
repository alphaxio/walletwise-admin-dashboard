'use client';
import { useState } from 'react';
import { useFinancialMutation, useFinancialRecord } from './useFinancialData';
import { usdRateRows } from '../constants/usdRates';
export function useUsdRateSettings() {
  const query = useFinancialRecord('usd/rates');
  const mutation = useFinancialMutation();
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [confirm, setConfirm] = useState(false);
  const data = query.data;
  const value = (key: string) => draft[key] ?? (data?.[key] == null ? '' : String(data[key]));
  const changed = usdRateRows.filter(row => draft[row.key] !== undefined && value(row.key) !== String(data?.[row.key]));
  const valid = changed.length > 0 && changed.every(row => value(row.key).trim() !== '' && Number.isFinite(Number(value(row.key))) && Number(value(row.key)) >= 0);

  const save = () => mutation.mutate({path:'usd/rates',method:'put',body:Object.fromEntries(changed.map(row => [row.key, Number(value(row.key))]))}, {onSuccess:() => {setDraft({});setConfirm(false);}});
  return {query,data,draft,setDraft,confirm,setConfirm,value,changed,valid,save,isSaving:mutation.isPending};
}
