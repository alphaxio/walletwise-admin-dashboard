import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import UserProfileCard from './UserProfileCard';

vi.mock('../UserActionButton/UserActionButton', () => ({ default: () => <button>Suspend Account</button> }));
vi.mock('../../hooks/useUserFlagControls', () => ({ useUserFlagControls: () => ({ openFlagDialog: vi.fn(), isOpen: false, setIsOpen: vi.fn(), setReason: vi.fn(), reason: '', submitFlag: vi.fn(), isUpdating: false }) }));
vi.mock('@/components/molecules/modals/FlagUserModal/FlagUserModal', () => ({ default: () => null }));
afterEach(cleanup);
const user = { id: 'user-123456789', first_name: 'Ada', last_name: 'Example', email: 'ada@example.com', phone_number: '+2348001234567', user_tag: 'ada', created_at: '2026-01-01T10:00:00Z', account_status: 'active' as const, is_blacklisted: false };

describe('user profile layout', () => {
  it('shows separate personal fields, full ID, KYC link and account controls', () => {
    render(<UserProfileCard user={user} kycId="kyc-1" />);
    for (const label of ['First name', 'Last name', 'Email address', 'Phone number', 'User ID', 'Member since']) expect(screen.getByText(label)).toBeTruthy();
    expect(screen.getByText(user.id)).toBeTruthy();
    expect(screen.getByText(user.email)).toBeTruthy();
    expect(screen.getByRole('link', { name: /Review KYC/ }).getAttribute('href')).toBe('/manage-kyc/info/kyc-1');
    expect(screen.getByRole('complementary', { name: 'Account controls' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Flag user' })).toBeTruthy();
  });
  it('shows the existing flag reason and remove action for flagged users', () => {
    render(<UserProfileCard user={user} isFlagged flagReason="Review unusual transfers" />);
    expect(screen.getByText('Flagged for review')).toBeTruthy();
    expect(screen.getByText('Review unusual transfers')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Remove user flag' })).toBeTruthy();
  });
});
