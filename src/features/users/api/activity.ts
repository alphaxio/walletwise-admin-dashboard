import { axiosInstance } from '@/lib/axiosInstance';
import type { ActivityPeriod } from '../types/activity';
import { normalizeActivityResponse } from '../helpers/activityResponse';

export async function getUserActivity({ userId, period, date, signal }: {
  userId: string;
  period: ActivityPeriod;
  date?: string;
  signal?: AbortSignal;
}) {
  const { data } = await axiosInstance.get(`/users/${encodeURIComponent(userId)}/activity`, {
    params: { period, ...(date ? { date } : {}) }, signal,
  });
  return normalizeActivityResponse(data, period);
}
