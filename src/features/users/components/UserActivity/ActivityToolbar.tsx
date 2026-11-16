import { ChevronLeft, ChevronRight, Download, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ACTIVITY_PERIODS } from '../../constants/activity';
import type { UserActivityState } from '../../hooks/useUserActivity';

export default function ActivityToolbar({ state }: { state: UserActivityState }) {
  return <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
    <div className="flex flex-wrap items-end gap-2">
      <Button variant="outline" size="icon" aria-label="Previous period" onClick={state.previous}><ChevronLeft /></Button>
      <label className="min-w-0 space-y-1 text-xs text-muted-foreground">Date in period
        <Input type="date" value={state.date} onChange={state.changeDate} className="w-40" aria-label="Activity date" />
      </label>
      <Button variant="outline" size="icon" aria-label="Next period" onClick={state.next}><ChevronRight /></Button>
      <Button variant="outline" onClick={state.refresh}><RefreshCw /> Refresh demo</Button>
      <Button variant="outline" onClick={state.download} disabled={!state.filteredCount}><Download /> Export demo CSV</Button>
    </div>
    <div className="flex flex-wrap gap-1 rounded-lg bg-muted p-1" aria-label="Activity period">
      {ACTIVITY_PERIODS.map(period => <Button key={period} size="sm" variant={state.period === period ? 'default' : 'ghost'} aria-pressed={state.period === period} onClick={state.periodActions[period]} className="flex-1 capitalize">{period}</Button>)}
    </div>
  </div>;
}
