import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import DateFilterComponent from './DateFilterComponent';
afterEach(cleanup);
describe('date range placeholder', () => {
  it('starts unfiltered and permits selecting Today as the first filter', () => {
    const change=vi.fn();
    render(<DateFilterComponent placeholder="All dates" onDateChange={change} />);
    expect(change).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button',{name:'All dates'}));
    fireEvent.click(screen.getByText('Today'));
    expect(change).toHaveBeenCalledWith(expect.objectContaining({label:'today',dateRange:{start:expect.any(Date),end:expect.any(Date)}}));
    expect(screen.getByRole('button',{name:'Today'})).toBeTruthy();
  });
  it('preserves the default presentation for existing callers', () => {
    render(<DateFilterComponent />);
    expect(screen.getByRole('button',{name:'Today'})).toBeTruthy();
  });
});
