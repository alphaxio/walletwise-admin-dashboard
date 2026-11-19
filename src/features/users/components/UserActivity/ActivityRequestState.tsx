import { Button } from '@/components/ui/button';
import TableLoader from '@/components/atoms/skeleton/TableLoader';
import type { UserActivityState } from '../../hooks/useUserActivity';

export default function ActivityRequestState({ state, allowed }: { state: UserActivityState; allowed: boolean }) {
  if (!allowed || state.isForbidden) return <div role="alert" className="rounded-xl border p-6 text-sm dark:border-gray-700">You need user_management.read permission to view this user’s activity.</div>;
  if (state.isPending) return <div role="status" aria-label="Loading user activity"><TableLoader /></div>;
  if (state.isError) return <div role="alert" className="space-y-3 rounded-xl border border-red-200 p-6 text-sm dark:border-red-900"><p>{state.errorMessage}</p><Button variant="outline" onClick={state.refresh} disabled={state.isFetching}>Retry</Button></div>;
  return null;
}
