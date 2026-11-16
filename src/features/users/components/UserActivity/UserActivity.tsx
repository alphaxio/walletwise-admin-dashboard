"use client";

import { Info } from 'lucide-react';
import { Input } from '@/components/ui/input';
import TableWrapper from '@/components/organisms/TableWrapper/TableWrapper';
import { useUserActivity } from '../../hooks/useUserActivity';
import { activityColumns } from './columns';
import ActivityToolbar from './ActivityToolbar';
import ActivitySummary from './ActivitySummary';
import ActivityCharts from './ActivityCharts';

export default function UserActivity() {
  const state = useUserActivity();

  return (
    <section className="min-w-0 space-y-5" aria-label="User activity demo">
      <div role="note" className="flex gap-3 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-100">
        <Info className="mt-0.5 size-5 shrink-0" />
        <div>
          <p className="font-semibold">Demo data · Awaiting backend integration</p>
          <p className="mt-1">
            All figures, events, devices, and verification details in this tab are dummy data,
            not this user’s actual activity. The sample starts on 12 November 2026.
          </p>
        </div>
      </div>
      <ActivityToolbar state={state} />
      <p role="status" className="text-xs text-muted-foreground">
        {state.range.start} to {state.displayEnd} · Africa/Lagos
        {state.refreshedAt ? ` · Demo refreshed at ${state.refreshedAt}` : ''}
      </p>
      <ActivitySummary summary={state.summary} comparison={state.comparison} />
      <ActivityCharts state={state} />
      <div className="min-w-0 rounded-xl border bg-card p-3 sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="font-semibold">Activity log</h3>
            <p className="text-xs text-muted-foreground">
              {state.filteredCount} demo events · Search, filter, sort, or export this period
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <Input
              aria-label="Search activity"
              placeholder="Search activity, channel, service…"
              value={state.search}
              onChange={state.changeSearch}
              className="w-full sm:w-72"
            />
            <select
              aria-label="Sort activity" value={state.sort} onChange={state.changeSort}
              className="h-9 rounded-md border bg-background px-3 text-sm"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="amount">Highest amount</option>
            </select>
            <select
              aria-label="Activity status" value={state.status} onChange={state.changeStatus}
              className="h-9 rounded-md border bg-background px-3 text-sm"
            >
              <option value="all">All statuses</option>
              <option value="success">Success</option>
              <option value="failed">Failed</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>
        <div className="min-w-0 overflow-x-auto">
          <TableWrapper columns={activityColumns} data={state.rows} {...state.pagination} />
        </div>
      </div>
    </section>
  );
}
