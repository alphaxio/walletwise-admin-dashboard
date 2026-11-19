import { afterEach, describe, expect, it, vi } from 'vitest';
import { axiosInstance } from '@/lib/axiosInstance';
import type { InternalAxiosRequestConfig } from 'axios';
import { getUserActivity } from './activity';
import { activityPayload } from '../testFixtures/activity';

vi.mock('@/lib/helpers/cookie', () => ({ readAuthCookie: () => 'test-admin-token' }));
const originalAdapter = axiosInstance.defaults.adapter;
const originalBase = axiosInstance.defaults.baseURL;
afterEach(() => { axiosInstance.defaults.adapter = originalAdapter; axiosInstance.defaults.baseURL = originalBase; });

describe('user activity request', () => {
  it('uses the configured admin API, route user ID, period/date and the existing Bearer interceptor', async () => {
    axiosInstance.defaults.baseURL = 'https://admin-api.walletwise.ng/api/v1/';
    const requests: InternalAxiosRequestConfig[] = [];
    axiosInstance.defaults.adapter = async config => { requests.push(config); return { config, data: activityPayload(config.params.period), status: 200, statusText: 'OK', headers: {} }; };
    const controller = new AbortController();
    const result = await getUserActivity({ userId: 'user-123', period: 'weekly', date: '2026-11-12', signal: controller.signal });
    expect(axiosInstance.getUri(requests[0])).toBe('https://admin-api.walletwise.ng/api/v1/users/user-123/activity?period=weekly&date=2026-11-12');
    expect(requests[0].headers.Authorization).toBe('Bearer test-admin-token');
    expect(requests[0].signal).toBe(controller.signal);
    expect(result.summary.received).toBe(12000000);
  });
  it('omits optional dates so the backend can use its Lagos default', async () => {
    let params: unknown;
    axiosInstance.defaults.adapter = async config => { params = config.params; return { config, data: activityPayload(config.params.period), status: 200, statusText: 'OK', headers: {} }; };
    await getUserActivity({ userId: 'user-123', period: 'monthly' });
    expect(params).toEqual({ period: 'monthly' });
  });
});
