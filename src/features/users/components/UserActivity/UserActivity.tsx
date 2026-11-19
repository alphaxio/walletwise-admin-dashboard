"use client";

import { useAdminPermission } from '@/lib/hooks/useAdminPermission';
import ActivityContext from './ActivityContext';
import ActivityRequestState from './ActivityRequestState';
import { useUserActivity } from '../../hooks/useUserActivity';
import ActivityLog from './ActivityLog';
import ActivityToolbar from './ActivityToolbar';
import ActivitySummary from './ActivitySummary';
import ActivityCharts from './ActivityCharts';

export default function UserActivity({ userId }: { userId: string }) {
  const { hasPermission } = useAdminPermission(['user_management.read']);
  const state = useUserActivity(userId, hasPermission);

  return (
    <section className="min-w-0 space-y-5" aria-label="User activity">
      <ActivityRequestState state={state} allowed={hasPermission} />
      {hasPermission && !state.isForbidden && <ActivityToolbar state={state} />}
      {hasPermission && !state.isError && !state.isPending && state.summary && <>
      <ActivityContext context={state.context} />
      <p role="status" className="text-xs text-muted-foreground dark:text-gray-400">
        {state.range.start} to {state.displayEnd} · Africa/Lagos
        {state.refreshedAt ? ` · Refreshed at ${state.refreshedAt}` : ''}
      </p>
      {state.recordsTruncated && <p className="text-xs text-amber-700 dark:text-amber-300">The API has truncated this activity log. Search and exports include loaded events only.</p>}
      <ActivitySummary summary={state.summary} comparison={state.comparison} />
      <ActivityCharts state={state} />
      <ActivityLog state={state} />
      </>}
    </section>
  );
}
