import '@testing-library/jest-dom/vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import UserActivity from './UserActivity';

vi.mock('./ActivityCharts', () => ({ default: () => <div>Activity charts</div> }));
afterEach(cleanup);

describe('user activity demo', () => {
  it('clearly labels dummy data and uses shared status bubbles in the feed', () => {
    render(<UserActivity />);
    expect(screen.getByRole('note').textContent).toContain('Awaiting backend integration');
    expect(screen.getByRole('note').textContent).toContain('not this user’s actual activity');
    expect(screen.getByText('Transfer to Yemi Balogun')).toBeTruthy();
    expect(screen.getByText('failed').className).toContain('rounded-full');
    expect(screen.getByRole('button', { name: 'Export demo CSV' })).not.toBeDisabled();
  });
  it('changes the date range with weekly and monthly controls', () => {
    render(<UserActivity />);
    fireEvent.click(screen.getByRole('button', { name: 'weekly' }));
    expect(screen.getByRole('status').textContent).toContain('2026-11-09 to 2026-11-15');
    fireEvent.click(screen.getByRole('button', { name: 'monthly' }));
    expect(screen.getByRole('status').textContent).toContain('2026-11-01 to 2026-11-30');
  });
  it('supports empty filtered states and disables empty exports', () => {
    render(<UserActivity />);
    fireEvent.change(screen.getByRole('combobox', { name: 'Activity status' }), { target: { value: 'failed' } });
    expect(screen.queryByText('Transfer to Yemi Balogun')).toBeNull();
    fireEvent.change(screen.getByRole('textbox', { name: 'Search activity' }), { target: { value: 'no matching event' } });
    expect(screen.getByRole('button', { name: 'Export demo CSV' })).toBeDisabled();
    expect(screen.getByText(/0 demo events/)).toBeTruthy();
  });
});
