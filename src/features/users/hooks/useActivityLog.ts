import { useState } from 'react';
import type { ChangeEvent } from 'react';
import type { UserActivityRecord } from '../types/activity';
import { exportActivity } from '../helpers/activity';

export function useActivityLog(records: UserActivityRecord[], date: string) {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [sort, setSort] = useState('newest');
  const filtered = records.filter(row => (status === 'all' || row.status === status) && `${row.description} ${row.channel} ${row.service} ${row.kind}`.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => sort === 'amount' ? (b.amountMinor ?? -1) - (a.amountMinor ?? -1) : sort === 'oldest' ? a.occurredAt.localeCompare(b.occurredAt) : b.occurredAt.localeCompare(a.occurredAt));
  const totalPages = Math.max(1, Math.ceil(filtered.length / limit));
  const currentPage = Math.min(page, totalPages);
  function resetPage() { setPage(1); }
  function download() { exportActivity(filtered, date); }
  function changeSearch(event: ChangeEvent<HTMLInputElement>) { setSearch(event.target.value); resetPage(); }
  function changeStatus(event: ChangeEvent<HTMLSelectElement>) { setStatus(event.target.value); resetPage(); }
  function changeSort(event: ChangeEvent<HTMLSelectElement>) { setSort(event.target.value); resetPage(); }
  function changeLimit(value: number) { setLimit(value); resetPage(); }
  function prevPage() { setPage(Math.max(1, currentPage - 1)); }
  function nextPage() { setPage(Math.min(totalPages, currentPage + 1)); }
  function changePage(value: number) { setPage(Math.max(1, Math.min(totalPages, Math.trunc(value) || 1))); }
  function goToLastPage() { setPage(totalPages); }
  function isFirstPage() { return currentPage === 1; }
  function isLastPage() { return currentPage >= totalPages; }
  return { search, status, sort, download, changeSearch, changeStatus, changeSort, resetPage,
    filteredCount: filtered.length, rows: filtered.slice((currentPage - 1) * limit, currentPage * limit),
    pagination: { currentPage, totalPages, limit, setLimit: changeLimit, setCurrentPage: changePage, prevPage, nextPage, goToFirstPage: resetPage, goToLastPage, isFirstPage, isLastPage } };
}
