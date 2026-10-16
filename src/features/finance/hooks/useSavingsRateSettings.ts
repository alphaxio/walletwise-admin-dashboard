'use client';
import { useState } from 'react';
import { useFinancialMutation, useFinancialRecord } from './useFinancialData';
import { savingsFields } from '../constants/savingsRates';
export function useSavingsRateSettings() {
  const query = useFinancialRecord('savings/rates');
  const mutation = useFinancialMutation();
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [confirm, setConfirm] = useState(false);
  const value = (key: string) => draft[key] ?? (query.data?.[key] == null ? '' : String(query.data[key]));
  const valid = savingsFields.every(([key]) => value(key).trim() !== '' && Number.isFinite(Number(value(key))) && Number(value(key)) >= 0 && Number(value(key)) <= 100);

  const save = () => mutation.mutate({path:'savings/rates',method:'put',body:{...Object.fromEntries(savingsFields.map(([key]) => [key,Number(value(key))])),penaltyMode:draft.penaltyMode ?? query.data?.penaltyMode ?? 'percentage'}}, {onSuccess:() => {setDraft({});setConfirm(false);}});
  return {query,draft,setDraft,confirm,setConfirm,value,valid,save,isSaving:mutation.isPending};
}
