'use client';
import { useState } from 'react';
import { format } from 'date-fns';
import type { DateFilterValue } from '@/lib/types';
import type { ListFilters } from '../types';
export function useFinancialFilters(filters:ListFilters,onChange:(changes:Partial<ListFilters>)=>void) {
  const [search, setSearch] = useState(filters.search);
  const [dateResetKey, setDateResetKey] = useState(0);
  function clearFilters() {
    setSearch('');
    setDateResetKey(previous => previous + 1);
    onChange({search:'',status:'',rail:'',planType:'',startDate:'',endDate:''});
  }
  const changeDate = ({dateRange}:DateFilterValue) => onChange({startDate:format(dateRange.start,'yyyy-MM-dd'),endDate:format(dateRange.end,'yyyy-MM-dd')});
  return {search,setSearch,dateResetKey,clearFilters,changeDate};
}
