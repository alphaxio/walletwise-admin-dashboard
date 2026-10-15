'use client';
import { useState } from 'react';
import { useFinancialMutation, useFinancialRecord } from './useFinancialData';
import { recordId } from '../helpers/records';
import type { RecordData, Resource } from '../types';
export function useFinancialDetail(resource:Resource,id:string,record:RecordData,close:()=>void) {
    const detailId = resource === 'usd/kyc' ? recordId(record) || id : id;
    const query = useFinancialRecord(`${resource}/${encodeURIComponent(detailId)}`, resource !== 'usd/transactions' && resource !== 'savings/accruals');
    const mutation = useFinancialMutation();
    const [action, setAction] = useState('');
    const [reason, setReason] = useState('');
    const data = query.data ?? record;
    const kyc = resource === 'usd/kyc';
    const account = resource === 'usd/accounts';
    const plan = resource === 'savings/plans';
    const actionId = kyc ? recordId(data, true) || id : id;
    const perform = () => { const path = `${resource}/${encodeURIComponent(actionId)}/${account ? 'status' : action}`; mutation.mutate({ path, method: account ? 'patch' : 'post', body: account ? { status: action } : { reason: reason.trim() } }, { onSuccess: () => { setAction(''); close(); } }); };
    const actions = kyc ? [] : account ? [data.status === 'frozen' ? 'active' : 'frozen', 'suspended'] : plan ? ['payout', 'force-liquidate'] : [];
    return {detailId,query,action,setAction,reason,setReason,data,kyc,account,plan,actionId,perform,actions,isSaving:mutation.isPending};
}
