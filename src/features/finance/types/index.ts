export type RecordData = Record<string, unknown>;
export interface FinancialRecord extends RecordData {
    id?: string | number;
    userId?: string;
    user_id?: string | number;
    status?: string;
}
export interface FinancialList {
    records: FinancialRecord[];
    totalPages: number;
    total: number;
    metrics: RecordData;
}
export interface ListFilters {
    page: number;
    limit: number;
    search: string;
    status: string;
    rail: string;
    planType: string;
    userId: string;
    startDate?: string;
    endDate?: string;
}
export type Resource = 'usd/kyc' | 'usd/accounts' | 'usd/transactions' | 'savings/plans' | 'savings/accruals';
export interface Field {
    key: string;
    label: string;
    currency?: 'USD' | 'NGN';
    filterStatus?: string;
}

export interface DetailField { label: string; path: string; format?: 'date' | 'status' | 'usd'; }
