import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import UserCardTransactions from '../UserCardTransactions/UserCardTransactions';
import UserReferralSection from '../UserReferralSection/UserReferralSection';
import UserDisputeSection from '../UserDisputeSection/UserDisputeSection';
import SessionsSection from '../SessionsSection/SessionsSection';
import UserLogsSection from '../UserLogsSection/UserLogsSection';
import SecuritySection from '../SecuritySection/SecuritySection';

vi.mock('@/components/organisms/TableWrapper/TableWrapper', () => ({ default: () => <table aria-label="Visible records"><tbody><tr><td>Records</td></tr></tbody></table> }));
vi.mock('@/lib/hooks/useFetchLocation', () => ({ useFetchLocation: () => ({ loading: false, logs: [] }) }));
afterEach(cleanup);
const pagination = { totalPages: 1, currentPage: 1, prevPage: vi.fn(), nextPage: vi.fn(), goToFirstPage: vi.fn(), goToLastPage: vi.fn(), isFirstPage: () => true, isLastPage: () => true, limit: 10, setLimit: vi.fn(), setCurrentPage: vi.fn(), isLoading: false };

describe('tab content is immediately visible', () => {
  it.each(['cards', 'referrals', 'disputes'])('renders %s records without an expand button', (section) => {
    render(section === 'cards' ? <UserCardTransactions {...pagination} cardTransactions={[]} /> : section === 'referrals' ? <UserReferralSection {...pagination} userReferrals={[]} /> : <UserDisputeSection {...pagination} userDisputes={[]} />);
    expect(screen.getByRole('table', { name: 'Visible records' })).toBeTruthy();
    expect(screen.queryByRole('button')).toBeNull();
  });
  it('renders logs, session and security sections without collapse controls', () => {
    render(<><SessionsSection sessions={[]} /><UserLogsSection userLogs={[]} /><SecuritySection securityQuestions={[]} /></>);
    expect(screen.getByRole('table')).toBeTruthy();
    expect(screen.getByText('Active Sessions')).toBeTruthy();
    expect(screen.getByText('Security Questions')).toBeTruthy();
    expect(screen.queryByRole('button')).toBeNull();
  });
});
