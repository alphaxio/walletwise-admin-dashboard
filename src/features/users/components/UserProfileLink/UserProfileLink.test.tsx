import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import UserProfileLink from './UserProfileLink';

const { push, resolve, error } = vi.hoisted(() => ({ push: vi.fn(), resolve: vi.fn(), error: vi.fn() }));
vi.mock('next/navigation', () => ({ useRouter: () => ({ push }) }));
vi.mock('../../api/resolveUser', () => ({ resolveUserIdByEmail: resolve }));
vi.mock('sonner', () => ({ toast: { error } }));
function mount(props: { name: string; id?: string; email?: string }) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  render(<QueryClientProvider client={client}><UserProfileLink {...props} /></QueryClientProvider>);
}
afterEach(cleanup);
beforeEach(() => vi.clearAllMocks());
describe('user profile navigation', () => {
  it('links directly when the user ID is available', () => {
    mount({ name: 'Ada', id: 'user-123', email: 'ada@example.com' });
    expect(screen.getByRole('link').getAttribute('href')).toBe('/manage-user/info/user-123');
    expect(resolve).not.toHaveBeenCalled();
  });
  it('resolves the email before opening the user profile', async () => {
    resolve.mockResolvedValue('user-123');
    mount({ name: 'Ada', email: 'ada@example.com' });
    fireEvent.click(screen.getByRole('button', { name: 'Ada' }));
    await waitFor(() => expect(push).toHaveBeenCalledWith('/manage-user/info/user-123'));
    expect(resolve).toHaveBeenCalledWith('ada@example.com');
  });
  it('reports a failed lookup without navigating', async () => {
    resolve.mockRejectedValue(new Error('No matching user'));
    mount({ name: 'Ada', email: 'ada@example.com' });
    fireEvent.click(screen.getByRole('button', { name: 'Ada' }));
    await waitFor(() => expect(error).toHaveBeenCalled());
    expect(push).not.toHaveBeenCalled();
  });
});
