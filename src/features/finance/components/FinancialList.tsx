'use client';
import UserProfileLink from '@/features/users/components/UserProfileLink/UserProfileLink';
import { useState } from 'react';
import { format } from 'date-fns';
import DateFilterComponent from '@/components/organisms/DateFilterComponent/DateFilterComponent';
import FinancialSummary from './FinancialSummary';
import { Button } from '@/components/ui/button';
import SearchInput from '@/components/molecules/SearchInput/SearchInput';
import PaginationComponent from '@/components/molecules/PaginationComponent/PaginationComponent';
import TableDate from '@/components/atoms/TableDate/TableDate';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import StatusBubble from '@/components/atoms/StatusBubble/StatusBubble';
import { useFinancialList } from '../hooks/useFinancialData';
import { display, money, read, recordId } from '../helpers/records';
import type { FinancialRecord, Resource } from '../types';
import UsdWalletActions from './UsdWalletActions';
import FinancialDetail from './FinancialDetail';
import RequestState from './RequestState';
import { columns } from '../constants/lists';
import PlanProgress from '@/components/atoms/PlanProgress/PlanProgress';
export default function FinancialList({ resource, userId = '' }: {
    resource: Resource;
    userId?: string;
}) {
    const query = useFinancialList(resource, userId);
    const [dateResetKey, setDateResetKey] = useState(0);
    const [search, setSearch] = useState('');
    const [selected, setSelected] = useState<FinancialRecord | null>(null);
    const [exporting, setExporting] = useState(false);
    const [exportError, setExportError] = useState('');
    const fields = columns[resource];
    const statuses = resource === 'usd/kyc' ? ['pending_kyc', 'kyc_approved', 'active', 'rejected', 'frozen'] : resource === 'usd/accounts' ? ['active', 'frozen', 'pending', 'suspended'] : resource === 'savings/plans' ? ['active', 'matured', 'liquidated'] : ['success', 'pending', 'failed'];
    const selectFilter = (label: string, key: 'status' | 'rail' | 'planType', options: string[]) => <label className="text-sm">{label}<select className="block border rounded p-2 bg-background" value={query.filters[key]} onChange={event => query.update({ [key]: event.target.value })}><option value="">All</option>{options.map(value => <option key={value} value={value}>{value.replaceAll('_', ' ')}</option>)}</select></label>;
    async function exportReport(format: 'csv' | 'xlsx') {
        setExporting(true);
        setExportError('');
        try {
            const { exportAccruals } = await import('../helpers/exportAccruals');
            await exportAccruals(query.filters, fields, format);
        }
        catch {
            setExportError('Export failed. Please retry.');
        }
        finally {
            setExporting(false);
        }
    }
    return <div className="space-y-6"><FinancialSummary resource={resource} values={query.data?.metrics} status={query.filters.status} onStatusChange={status => query.update({status})} />
 <div className="flex flex-wrap items-end gap-3"><SearchInput value={search} placeholder={resource === "usd/kyc" ? "Search name, email, user tag or Miden customer ID" : "Search name, email, user tag or phone"} handleChange={setSearch} handleClear={() => { setSearch(''); query.update({search:''}); }} onSubmit={() => query.update({search})} /><Button variant="outline" type="button" onClick={() => { setSearch(''); setDateResetKey(previous => previous + 1); query.update({search:'',status:'',rail:'',planType:'',startDate:'',endDate:''}); }}>Clear filters</Button>{resource !== 'usd/kyc' && selectFilter('Status', 'status', statuses)}{resource === 'usd/kyc' && <DateFilterComponent key={dateResetKey} placeholder="All dates" onDateChange={({dateRange}) => query.update({startDate:format(dateRange.start,'yyyy-MM-dd'),endDate:format(dateRange.end,'yyyy-MM-dd')})} />}{resource === 'usd/transactions' && selectFilter('Rail', 'rail', ['ACH', 'Wire', 'SWIFT', 'Wallet-to-Wallet', 'Currency Exchange'])}{resource.startsWith('savings/') && selectFilter('Plan type', 'planType', ['flex', 'lock', 'goal'])}<Button type="button" variant="outline" onClick={() => query.refetch()}>Refresh</Button></div>
 {userId && <p>Transactions for user: {userId}</p>}<RequestState pending={query.isPending} error={query.isError} retry={() => query.refetch()}/>{!query.isPending && !query.isError && <><div className="overflow-x-auto rounded border"><Table><TableHeader><TableRow>{fields.map(field => <TableHead key={field.key}>{field.label}</TableHead>)}{resource !== 'savings/accruals' && <TableHead>Action</TableHead>}</TableRow></TableHeader><TableBody>{query.data?.records.map((record, index) => <TableRow key={recordId(record) || index}>{fields.map(field => <TableCell key={field.key} className="whitespace-nowrap">{['createdAt', 'submittedAt', 'startDate', 'maturityDate', 'date'].includes(field.key) ? <TableDate date={typeof read(record, field.key) === 'string' ? String(read(record, field.key)) : ''} showWithTime={['createdAt', 'submittedAt'].includes(field.key)} /> : ['user.name', 'user.email', 'user.tag'].includes(field.key) ? <UserProfileLink name={display(read(record, field.key))} id={recordId(record, true) || undefined} email={typeof read(record, 'user.email') === 'string' ? String(read(record, 'user.email')) : undefined} /> : ['status', 'threatStatus', 'restrictionStatus'].includes(field.key) ? <StatusBubble status={typeof read(record, field.key) === 'string' ? String(read(record, field.key)) : undefined} /> : field.key === 'progress' ? <PlanProgress start={record.startDate} end={record.maturityDate}/> : field.currency ? money(read(record, field.key), field.currency) : display(read(record, field.key))}</TableCell>)}{resource !== 'savings/accruals' && <TableCell>{resource === 'usd/kyc' ? <UsdWalletActions walletId={recordId(record)} status={record.status} onReview={() => setSelected(record)} /> : <Button variant="outline" disabled={!recordId(record,resource.startsWith('usd/') && resource !== 'usd/transactions')} onClick={() => setSelected(record)}>View</Button>}</TableCell>}</TableRow>)}{!query.data?.records.length && <TableRow><TableCell colSpan={fields.length + 1} className="text-center p-10">No records match these filters.</TableCell></TableRow>}</TableBody></Table></div><div className="flex flex-wrap gap-3 items-center"><p>{query.data?.total} records · Page {query.filters.page} of {query.data?.totalPages}</p><PaginationComponent totalPages={query.data?.totalPages ?? 1} currentPage={query.filters.page} limit={query.filters.limit} setLimit={limit => query.update({limit})} prevPage={() => query.update({page:Math.max(1,query.filters.page-1)})} nextPage={total => query.update({page:Math.min(total,query.filters.page+1)})} goToFirstPage={() => query.update({page:1})} goToLastPage={total => query.update({page:total})} isFirstPage={() => query.filters.page <= 1} isLastPage={total => query.filters.page >= total} setCurrentPage={page => query.update({page:Math.max(1,Math.min(query.data?.totalPages ?? 1,page))})} />{resource === 'savings/accruals' && <><Button disabled={exporting} onClick={() => exportReport('csv')}>Export CSV</Button><Button disabled={exporting} onClick={() => exportReport('xlsx')}>Export Excel</Button></>}</div></>}{exportError && <p role="alert">{exportError}</p>}{selected && <FinancialDetail resource={resource} id={recordId(selected, resource.startsWith('usd/') && resource !== 'usd/transactions')} record={selected} close={() => setSelected(null)}/>}</div>;
}
