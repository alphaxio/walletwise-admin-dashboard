import type { Resource } from '../types';

export interface FinancialFilterOption {
  label: string;
  key: 'status' | 'rail' | 'planType';
  options: string[];
}
const transactionStatus: FinancialFilterOption = {
  label: 'Status', key: 'status', options: ['success', 'pending', 'failed'],
};
const planType: FinancialFilterOption = {
  label: 'Plan type', key: 'planType', options: ['flex', 'lock', 'goal'],
};
export const listFilters: Record<Resource, FinancialFilterOption[]> = {
  'usd/kyc': [],
  'usd/accounts': [{label:'Status', key:'status', options:['active','frozen','pending','suspended']}],
  'usd/transactions': [transactionStatus, {label:'Rail', key:'rail', options:['ACH','Wire','SWIFT','Wallet-to-Wallet','Currency Exchange']}],
  'savings/plans': [{label:'Status', key:'status', options:['active','matured','liquidated']}, planType],
  'savings/accruals': [transactionStatus, planType],
};
