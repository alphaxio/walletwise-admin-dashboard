import { ChevronLeft, ChevronRight, Download, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ACTIVITY_PERIODS } from '../../constants/activity';
import type { UserActivityState } from '../../hooks/useUserActivity';

export default function ActivityToolbar({ state }: { state: UserActivityState }) {
  return <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
    <div className="flex flex-wrap items-end gap-2">
      <Button variant="outline" className="dark:bg-gray-900 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700" size="icon" aria-label="Previous period" onClick={state.previous}><ChevronLeft /></Button>
      <label className="min-w-0 space-y-1 text-xs text-muted-foreground dark:text-gray-400">Date in period
        <Input type="date" value={state.date} onChange={state.changeDate} className="w-40 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100" aria-label="Activity date" />
      </label>
      <Button variant="outline" className="dark:bg-gray-900 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700" size="icon" aria-label="Next period" onClick={state.next}><ChevronRight /></Button>
      <Button variant="outline" className="dark:bg-gray-900 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700" onClick={state.refresh} disabled={state.isFetching}><RefreshCw /> Refresh</Button>
      <Button variant="outline" className="dark:bg-gray-900 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700" onClick={state.download} disabled={!state.filteredCount || state.isFetching || state.isError}><Download /> Export loaded CSV</Button>
    </div>
    <div className="flex flex-wrap gap-1 rounded-lg bg-muted dark:bg-gray-800 p-1" aria-label="Activity period">
      {ACTIVITY_PERIODS.map(period => <Button key={period} size="sm" variant={state.period === period ? 'default' : 'ghost'} aria-pressed={state.period === period} onClick={state.periodActions[period]} className={`flex-1 capitalize ${state.period === period ? "dark:bg-purple-800 dark:text-white dark:hover:bg-purple-700" : "dark:text-gray-300"}`}>{period}</Button>)}
    </div>
  </div>;
}
