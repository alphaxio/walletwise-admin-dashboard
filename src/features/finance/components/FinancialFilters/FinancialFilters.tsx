'use client';

import { useFinancialFilters } from '../../hooks/useFinancialFilters';
import DateFilterComponent from '@/components/organisms/DateFilterComponent/DateFilterComponent';
import SearchInput from '@/components/molecules/SearchInput/SearchInput';
import { Button } from '@/components/ui/button';
import { listFilters } from '../../constants/listFilters';
import type { ListFilters, Resource } from '../../types/index';

export default function FinancialFilters({resource, filters, onChange, onRefresh}: {
  resource: Resource;
  filters: ListFilters;
  onChange: (changes: Partial<ListFilters>) => void;
  onRefresh: () => void;
}) {
  const {search,setSearch,dateResetKey,clearFilters,changeDate} = useFinancialFilters(filters,onChange);
  return <div className="flex flex-wrap items-end gap-3">
    <SearchInput value={search} placeholder={resource === 'usd/kyc' ? 'Search name, email, user tag or Miden customer ID' : 'Search name, email, user tag or phone'} handleChange={setSearch} handleClear={() => {setSearch('');onChange({search:''});}} onSubmit={() => onChange({search})} />
    <Button variant="outline" type="button" onClick={clearFilters}>Clear filters</Button>
    {listFilters[resource].map(filter => <label key={filter.key} className="text-sm">{filter.label}
      <select className="block border rounded p-2 bg-background" value={filters[filter.key]} onChange={event => onChange({[filter.key]:event.target.value})}>
        <option value="">All</option>
        {filter.options.map(value => <option key={value} value={value}>{value.replaceAll('_',' ')}</option>)}
      </select>
    </label>)}
    {resource === 'usd/kyc' && <DateFilterComponent key={dateResetKey} placeholder="All dates" onDateChange={changeDate} />}
    <Button type="button" variant="outline" onClick={onRefresh}>Refresh</Button>
  </div>;
}
