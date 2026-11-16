import { act, renderHook } from '@testing-library/react';
import type { ChangeEvent } from 'react';
import { describe, expect, it } from 'vitest';
import { useUserActivity } from './useUserActivity';

describe('activity controls', () => {
  it('paginates without changing totals and resets pagination for new periods', () => {
    const { result } = renderHook(useUserActivity);
    expect(result.current.rows).toHaveLength(10);
    act(() => result.current.pagination.nextPage());
    expect(result.current.rows).toHaveLength(1);
    expect(result.current.summary.received).toBe(12000000);
    act(() => result.current.periodActions.weekly());
    expect(result.current.pagination.currentPage).toBe(1);
    expect(result.current.filteredCount).toBe(18);
    act(() => result.current.pagination.setCurrentPage(999));
    expect(result.current.pagination.currentPage).toBe(2);
  });
  it('filters only the feed, preserves summary, and handles empty date windows', () => {
    const { result } = renderHook(useUserActivity);
    act(() => result.current.changeStatus({ target: { value: 'failed' } } as ChangeEvent<HTMLSelectElement>));
    expect(result.current.rows).toHaveLength(1);
    expect(result.current.summary.spent).toBe(8750000);
    act(() => result.current.changeSearch({ target: { value: 'electricity' } } as ChangeEvent<HTMLInputElement>));
    expect(result.current.rows).toHaveLength(0);
    act(() => result.current.next());
    expect(result.current.summary.transactions).toBe(0);
    expect(result.current.date).toBe('2026-11-13');
    expect(result.current.pagination.isLastPage()).toBe(true);
  });
});
