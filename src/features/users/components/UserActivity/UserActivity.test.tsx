import '@testing-library/jest-dom/vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import UserActivity from './UserActivity';
import { normalizeActivityResponse, ActivityResponseError } from '../../helpers/activityResponse';
import { activityPayload, emptyActivityPayload } from '../../testFixtures/activity';

const { request, permissions } = vi.hoisted(() => ({ request: vi.fn(), permissions: { allowed: true } }));
vi.mock('../../api/activity', () => ({ getUserActivity: request }));
vi.mock('@/lib/hooks/useAdminPermission', () => ({ useAdminPermission: () => ({ hasPermission: permissions.allowed }) }));
vi.mock('./ActivityCharts', () => ({ default: () => <div>Activity charts</div> }));
function mount() {
  const client = new QueryClient();
  return render(<QueryClientProvider client={client}><UserActivity userId="user-123" /></QueryClientProvider>);
}
beforeEach(() => { vi.clearAllMocks(); permissions.allowed = true; request.mockResolvedValue(normalizeActivityResponse(activityPayload(), 'daily')); });
afterEach(cleanup);

describe('live user activity', () => {
  it('renders backend data and shared status bubbles without demo content', async () => {
    mount();
    await screen.findByText('Transfer to Yemi Balogun');
    expect(screen.queryByText(/Demo/)).toBeNull();
    expect(screen.getByText('failed').className).toContain('rounded-full');
    expect(screen.getByRole('button', { name: 'Export loaded CSV' })).not.toBeDisabled();
    expect(screen.getByText('₦120,000.00')).toBeTruthy();
    expect(screen.getByText('₦0.00')).toBeTruthy();
    expect(screen.getByText(/The API has truncated this activity log/)).toBeTruthy();
  });
  it('renders the supplied empty-response shape and preserves unavailable sessions', async () => {
    request.mockResolvedValue(normalizeActivityResponse(emptyActivityPayload(), 'daily'));
    mount();
    await screen.findByText('Session count unavailable');
    expect(screen.getByText('N/A')).toBeTruthy();
    expect(screen.getByText('₦136,414.44')).toBeTruthy();
    expect(screen.getByText('0 of 1 days checked in')).toBeTruthy();
    expect(screen.getByText('Tier 3')).toBeTruthy();
    expect(screen.getByText('iPhone13,3 · IOS 26.5.2')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Export loaded CSV' })).toBeDisabled();
    expect(screen.queryByText(/truncated this activity log/)).toBeNull();
  });
  it('only offers backend-supported periods', async () => {
    mount(); await screen.findByText('Transfer to Yemi Balogun');
    expect(screen.getByRole('button', { name: 'daily' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'weekly' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'monthly' })).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'yearly' })).toBeNull();
  });
  it('filters loaded events without changing summary totals', async () => {
    mount(); await screen.findByText('Transfer to Yemi Balogun');
    fireEvent.change(screen.getByRole('combobox', { name: 'Activity status' }), { target: { value: 'failed' } });
    expect(screen.queryByText('Transfer to Yemi Balogun')).toBeNull();
    expect(screen.getByText('₦120,000.00')).toBeTruthy();
    fireEvent.change(screen.getByRole('textbox', { name: 'Search activity' }), { target: { value: 'no match' } });
    expect(screen.getByRole('button', { name: 'Export loaded CSV' })).toBeDisabled();
  });
  it('does not request activity without the required permission', () => {
    permissions.allowed = false; mount();
    expect(screen.getByRole('alert')).toHaveTextContent('user_management.read');
    expect(request).not.toHaveBeenCalled();
    expect(screen.queryByText('Activity charts')).toBeNull();
  });
  it('shows a retryable schema error instead of fabricated figures', async () => {
    request.mockRejectedValue(new ActivityResponseError()); mount();
    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('expected format'));
    expect(screen.queryByText('Received')).toBeNull();
    expect(screen.getByRole('button', { name: 'Retry' })).toBeTruthy();
  });
  it('refreshes data through the API', async () => {
    mount(); await screen.findByText('Transfer to Yemi Balogun');
    fireEvent.click(screen.getByRole('button', { name: 'Refresh' }));
    await waitFor(() => expect(request).toHaveBeenCalledTimes(2));
  });
});
