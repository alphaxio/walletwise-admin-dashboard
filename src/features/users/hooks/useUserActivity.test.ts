import { createElement, type ReactNode } from 'react';
import { act, cleanup, renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useUserActivity } from './useUserActivity';
import { normalizeActivityResponse } from '../helpers/activityResponse';
import { activityPayload } from '../testFixtures/activity';

const { request } = vi.hoisted(() => ({ request: vi.fn() }));
vi.mock('../api/activity', () => ({ getUserActivity: request }));
function mount(id = 'user-1', enabled = true) {
  const client = new QueryClient();
  const wrapper = ({ children }: { children: ReactNode }) => createElement(QueryClientProvider, { client }, children);
  return renderHook(({ id, enabled }) => useUserActivity(id, enabled), { wrapper, initialProps: { id, enabled } });
}
beforeEach(() => { vi.clearAllMocks(); request.mockImplementation(({ period }) => Promise.resolve(normalizeActivityResponse(activityPayload(period), period))); });
afterEach(() => { cleanup(); vi.useRealTimers(); });

describe('live activity controls', () => {
  it('defaults to today in Lagos and reloads on user, period and date changes', async () => {
    vi.useFakeTimers({ toFake: ['Date'] }); vi.setSystemTime(new Date('2026-11-11T23:30:00Z'));
    const { result, rerender } = mount();
    await waitFor(() => expect(result.current.summary?.received).toBe(12000000));
    expect(request).toHaveBeenLastCalledWith(expect.objectContaining({ userId: 'user-1', period: 'daily', date: '2026-11-12' }));
    act(() => result.current.periodActions.weekly());
    await waitFor(() => expect(request).toHaveBeenLastCalledWith(expect.objectContaining({ period: 'weekly' })));
    act(() => result.current.next());
    await waitFor(() => expect(request).toHaveBeenLastCalledWith(expect.objectContaining({ date: '2026-11-19' })));
    rerender({ id: 'user-2', enabled: true });
    await waitFor(() => expect(request).toHaveBeenLastCalledWith(expect.objectContaining({ userId: 'user-2' })));
  });
  it('does not fetch without permission and does not show cached data after access is revoked', async () => {
    const { result, rerender } = mount('user-1', false);
    expect(request).not.toHaveBeenCalled();
    rerender({ id: 'user-1', enabled: true });
    await waitFor(() => expect(result.current.summary).toBeDefined());
    rerender({ id: 'user-1', enabled: false });
    expect(result.current.summary).toBeUndefined();
  });
  it('refreshes the API and keeps feed filters from changing server aggregates', async () => {
    const { result } = mount();
    await waitFor(() => expect(result.current.summary).toBeDefined());
    act(() => result.current.changeStatus({ target: { value: 'failed' } } as React.ChangeEvent<HTMLSelectElement>));
    expect(result.current.rows).toHaveLength(1);
    expect(result.current.summary?.spent).toBe(8750000);
    await act(async () => { await result.current.refresh(); });
    expect(request).toHaveBeenCalledTimes(2);
    expect(result.current.refreshedAt).not.toBeNull();
  });
  it('does not retry forbidden responses or turn errors into zero activity', async () => {
    const error = new AxiosError('Forbidden');
    error.response = { status: 403, data: {}, headers: {}, config: {} as never, statusText: 'Forbidden' };
    request.mockRejectedValue(error);
    const { result } = mount();
    await waitFor(() => expect(result.current.isForbidden).toBe(true));
    expect(request).toHaveBeenCalledTimes(1);
    expect(result.current.summary).toBeUndefined();
  });
});
