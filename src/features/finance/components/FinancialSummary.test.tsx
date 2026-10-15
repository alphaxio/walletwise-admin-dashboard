import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import FinancialSummary from './FinancialSummary';
afterEach(cleanup);
describe('wallet summary status filters', () => {
  it('filters each status and clears the filter through total accounts', () => {
    const change = vi.fn();
    render(<FinancialSummary resource="usd/kyc" status="frozen" values={{frozen:0,totalBalance:64.04}} onStatusChange={change} />);
    expect(screen.getByRole('button',{name:/Frozen/}).getAttribute('aria-pressed')).toBe('true');
    for (const [label,status] of [['Frozen','frozen'],['Pending KYC','pending_kyc'],['KYC approved','kyc_approved'],['Active','active'],['Rejected','rejected'],['Total accounts','']]) {
      fireEvent.click(screen.getByRole('button',{name:new RegExp(label)}));
      expect(change).toHaveBeenLastCalledWith(status);
    }
    expect(screen.getAllByRole('button')).toHaveLength(6);
    expect(screen.queryByRole('button',{name:/Total USD balance/})).toBeNull();
  });
});
