import { addDays, format, parseISO } from 'date-fns';
import { useState } from 'react';
import type { ChangeEvent } from 'react';
import type { ActivityPeriod } from '../types/activity';
import { DEMO_ACTIVITY, DEMO_ACTIVITY_DATE } from '../constants/activity';
import { compareActivity, activityRange, activityServices, activityBuckets, exportActivity, selectActivity, shiftActivityDate, summarizeActivity } from '../helpers/activity';

export function useUserActivity() {
  const [period, setPeriod] = useState<ActivityPeriod>('daily');
  const [date, setDate] = useState(DEMO_ACTIVITY_DATE);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [sort, setSort] = useState('newest');
  const [refreshedAt, setRefreshedAt] = useState<string | null>(null);
  const records = selectActivity(DEMO_ACTIVITY, date, period);
  const filtered = records.filter(row => (status === 'all' || row.status === status) && `${row.description} ${row.channel} ${row.service} ${row.kind}`.toLowerCase().includes(search.toLowerCase())).sort((a, b) => sort === 'amount' ? (b.amountMinor ?? -1) - (a.amountMinor ?? -1) : sort === 'oldest' ? a.occurredAt.localeCompare(b.occurredAt) : b.occurredAt.localeCompare(a.occurredAt));
  const totalPages = Math.max(1, Math.ceil(filtered.length / limit));
  function resetPage() { setCurrentPage(1); }
  function changePeriod(value: ActivityPeriod) { setPeriod(value); resetPage(); }
  function changeDate(event: ChangeEvent<HTMLInputElement>) { if (event.target.value) { setDate(event.target.value); resetPage(); } }
  function previous() { setDate(shiftActivityDate(date, period, -1)); resetPage(); }
  function next() { setDate(shiftActivityDate(date, period, 1)); resetPage(); }
  function refresh() { setRefreshedAt(new Date().toLocaleTimeString('en-GB', { timeZone: 'Africa/Lagos' })); }
  function download() { exportActivity(filtered, date); }
  function changeSearch(event: ChangeEvent<HTMLInputElement>) { setSearch(event.target.value); resetPage(); }
  function changeStatus(event: ChangeEvent<HTMLSelectElement>) { setStatus(event.target.value); resetPage(); }
  function changeSort(event: ChangeEvent<HTMLSelectElement>) { setSort(event.target.value); resetPage(); }
  function changeLimit(value: number) { setLimit(value); resetPage(); }
  function prevPage() { setCurrentPage(page => Math.max(1, page - 1)); }
  function nextPage() { setCurrentPage(page => Math.min(totalPages, page + 1)); }
  function changePage(value: number) { setCurrentPage(Math.max(1, Math.min(totalPages, Math.trunc(value) || 1))); }
  function goToLastPage() { setCurrentPage(totalPages); }
  function goToFirstPage() { resetPage(); }
  function isFirstPage() { return currentPage === 1; }
  function isLastPage() { return currentPage >= totalPages; }
  const comparison = compareActivity(summarizeActivity(records), selectActivity(DEMO_ACTIVITY, shiftActivityDate(date, period, -1), period), period);
  const periodActions = { daily: () => changePeriod('daily'), weekly: () => changePeriod('weekly'), monthly: () => changePeriod('monthly') };
  const displayEnd = format(addDays(parseISO(activityRange(date, period).end), -1), 'yyyy-MM-dd');
  return {
    periodActions, displayEnd, comparison,
    period, date, search, status, sort, changeSort, refreshedAt, changePeriod, changeDate, previous, next, refresh, download, changeSearch, changeStatus,
    range: activityRange(date, period), summary: summarizeActivity(records), buckets: activityBuckets(records, date, period), services: activityServices(records),
    rows: filtered.slice((currentPage - 1) * limit, currentPage * limit), filteredCount: filtered.length,
    pagination: { totalPages, currentPage, limit, setLimit: changeLimit, setCurrentPage: changePage, prevPage, nextPage, goToFirstPage, goToLastPage, isFirstPage, isLastPage },
  };
}
export type UserActivityState = ReturnType<typeof useUserActivity>;
