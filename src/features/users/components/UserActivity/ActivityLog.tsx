import { Input } from '@/components/ui/input';
import TableWrapper from '@/components/organisms/TableWrapper/TableWrapper';
import { activityColumns } from './columns';
import type { UserActivityState } from '../../hooks/useUserActivity';

export default function ActivityLog({ state }: { state: UserActivityState }) {
  return (
      <div className="min-w-0 rounded-xl border bg-card dark:bg-gray-900 dark:border-gray-800 dark:text-gray-100 p-3 sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="font-semibold">Activity log</h3>
            <p className="text-xs text-muted-foreground dark:text-gray-400">
              {state.filteredCount} matching events · Search, filter, sort, or export loaded events
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <Input
              aria-label="Search activity"
              placeholder="Search activity, channel, service…"
              value={state.search}
              onChange={state.changeSearch}
              className="w-full sm:w-72 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
            />
            <select
              aria-label="Sort activity" value={state.sort} onChange={state.changeSort}
              className="h-9 rounded-md border bg-background dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 px-3 text-sm"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="amount">Highest amount</option>
            </select>
            <select
              aria-label="Activity status" value={state.status} onChange={state.changeStatus}
              className="h-9 rounded-md border bg-background dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 px-3 text-sm"
            >
              <option value="all">All statuses</option>
              <option value="success">Success</option>
              <option value="failed">Failed</option>
              <option value="pending">Pending</option>
              <option value="reversed">Reversed</option>
            </select>
          </div>
        </div>
        <div className="min-w-0 overflow-x-auto">
          <TableWrapper columns={activityColumns} data={state.rows} {...state.pagination} showExport={false} />
        </div>
      </div>
  );
}
