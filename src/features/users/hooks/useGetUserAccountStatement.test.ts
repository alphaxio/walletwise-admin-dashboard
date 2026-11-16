import { createElement, type ReactNode } from 'react';
import { act, cleanup, renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useGetUserAccountStatement } from './useGetUserAccountStatement';

const { request } = vi.hoisted(() => ({ request: vi.fn() }));
vi.mock('../api/accountStatement', () => ({ userAccountStatement: request }));
vi.mock('@/lib/toast', () => ({ toast: { error: vi.fn() } }));
afterEach(() => { cleanup(); vi.clearAllMocks(); });
function wrapper({ children }: { children: ReactNode }) {
  const client = new QueryClient({ defaultOptions: { mutations: { retry: false } } });
  return createElement(QueryClientProvider, { client }, children);
}

describe('statement date shortcuts', () => {
  it('requires a full range and uses inclusive 7- and 30-day presets', () => {
    const { result } = renderHook(() => useGetUserAccountStatement('user-1'), { wrapper });
    expect(result.current.hasCompleteRange).toBe(false);
    act(() => result.current.selectWeek());
    expect(result.current.hasCompleteRange).toBe(true);
    const week = result.current.dateRange!;
    expect(Math.round((week.to!.getTime() - week.from!.getTime()) / 86400000)).toBe(6);
    act(() => result.current.selectMonth());
    const month = result.current.dateRange!;
    expect(Math.round((month.to!.getTime() - month.from!.getTime()) / 86400000)).toBe(29);
    act(() => result.current.selectCurrentMonth());
    expect(result.current.dateRange?.from?.getDate()).toBe(1);
  });
  it('sends the selected range and route user ID to the existing PDF endpoint', async () => {
    request.mockImplementation(() => new Promise<Blob>(() => {}));
    const { result } = renderHook(() => useGetUserAccountStatement('user-1'), { wrapper });
    act(() => result.current.changeDateRange({ from: new Date(2026, 10, 1), to: new Date(2026, 10, 12) }));
    act(() => result.current.handleDownload());
    await waitFor(() => expect(request).toHaveBeenCalledWith(expect.objectContaining({ userId: 'user-1', startDate: '2026-11-01', endDate: '2026-11-12' }), expect.anything()));
  });
});
