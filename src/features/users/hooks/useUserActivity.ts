import { useState } from 'react';
import type { ChangeEvent } from 'react';
import { useQuery } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { addDays, format, parseISO } from 'date-fns';
import type { ActivityPeriod, UserActivityRecord } from '../types/activity';
import { getUserActivity } from '../api/activity';
import { ActivityResponseError } from '../helpers/activityResponse';
import { activityComparisonLabels, activityRange, lagosToday, shiftActivityDate } from '../helpers/activity';
import { useActivityLog } from './useActivityLog';

const EMPTY_RECORDS: UserActivityRecord[] = [];
export function useUserActivity(userId: string, enabled = true) {
  const [period, setPeriod] = useState<ActivityPeriod>('daily');
  const [date, setDate] = useState(lagosToday);
  const [refreshedAt, setRefreshedAt] = useState<string | null>(null);
  const query = useQuery({
    queryKey: ['user-activity', userId, period, date],
    queryFn: ({ signal }) => getUserActivity({ userId, period, date, signal }),
    enabled: enabled && Boolean(userId), staleTime: 30000, refetchOnWindowFocus: false,
    retry: (attempt, error) => !(error instanceof ActivityResponseError) && !(isAxiosError(error) && [401, 403].includes(error.response?.status ?? 0)) && attempt < 1,
  });
  const data = enabled ? query.data : undefined;
  const log = useActivityLog(data?.records ?? EMPTY_RECORDS, date);
  function changePeriod(value: ActivityPeriod) { setPeriod(value); setRefreshedAt(null); log.resetPage(); }
  function changeDate(event: ChangeEvent<HTMLInputElement>) { if (event.target.value) { setDate(event.target.value); setRefreshedAt(null); log.resetPage(); } }
  function previous() { setDate(shiftActivityDate(date, period, -1)); setRefreshedAt(null); log.resetPage(); }
  function next() { setDate(shiftActivityDate(date, period, 1)); setRefreshedAt(null); log.resetPage(); }
  async function refresh() {
    const result = await query.refetch();
    if (!result.error) setRefreshedAt(new Date().toLocaleTimeString('en-GB', { timeZone: 'Africa/Lagos' }));
  }
  const range = data?.range ?? activityRange(date, period);
  return {
    ...log, period, date, refreshedAt, changeDate, previous, next, refresh,
    periodActions: { daily: () => changePeriod('daily'), weekly: () => changePeriod('weekly'), monthly: () => changePeriod('monthly') },
    range, displayEnd: format(addDays(parseISO(range.end), -1), 'yyyy-MM-dd'),
    summary: data?.summary, context: data?.context, comparison: activityComparisonLabels(data?.comparison, period),
    buckets: data?.buckets ?? [], services: data?.services ?? [], recordsTruncated: data?.recordsTruncated ?? false,
    loadedCount: data?.records.length ?? 0,
    isPending: query.isPending, isFetching: query.isFetching, isError: query.isError,
    isForbidden: isAxiosError(query.error) && query.error.response?.status === 403,
    errorMessage: query.error instanceof ActivityResponseError ? query.error.message : isAxiosError(query.error) && query.error.response?.status === 401 ? 'Your session has expired. Sign in again to view activity.' : 'Unable to load user activity. Please try again.',
  };
}
export type UserActivityState = ReturnType<typeof useUserActivity>;
