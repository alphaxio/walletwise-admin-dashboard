import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import UsdRateSettings from './UsdRateSettings';
import { usdRateRows } from '../../constants/usdRates';
const { mutate, data } = vi.hoisted(() => ({ mutate: vi.fn(), data: {} as Record<string, unknown> }));
vi.mock('../../hooks/useFinancialData', () => ({ useFinancialRecord: () => ({data,isPending:false,isError:false,refetch:vi.fn()}), useFinancialMutation: () => ({mutate,isPending:false}) }));
afterEach(cleanup);
beforeEach(() => {
  mutate.mockClear();
  Object.assign(data,{id:1,currency:'USD',updated_at:'2026-04-01T09:24:58+01:00'});
  usdRateRows.forEach(row => {data[row.key] = row.rate ? '1600.0000' : '4.00';data[row.providerKey] = row.rate ? '1550.0000' : '3.00';});
});
describe('USD rates API contract', () => {
  it('displays customer and provider rates and all transfer fees', () => {
    render(<UsdRateSettings />);
    expect((screen.getByLabelText('Buy rate (NGN / USD)') as HTMLInputElement).value).toBe('1600.0000');
    expect(screen.getAllByRole('spinbutton')).toHaveLength(11);
    const row = screen.getByLabelText('Buy rate (NGN / USD)').closest('tr')!;
    expect(within(row).getByText(/1,550\.0000/)).toBeTruthy();
    expect(screen.getByLabelText('Internal transfer fee (USD)')).toBeTruthy();
    expect(screen.getByLabelText('Network transfer fee (USD)')).toBeTruthy();
    expect(screen.getByLabelText('NGN transfer fee (USD)')).toBeTruthy();
    expect(screen.queryByText('Live base exchange rate')).toBeNull();
  });
  it('requires confirmation and submits changed customer keys in snake_case', () => {
    render(<UsdRateSettings />);
    fireEvent.change(screen.getByLabelText('ACH transfer fee (USD)'),{target:{value:'4.50'}});
    fireEvent.click(screen.getByRole('button',{name:'Review changes'}));
    expect(mutate).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button',{name:'Confirm and save'}));
    expect(mutate).toHaveBeenCalledWith({path:'usd/rates',method:'put',body:{ach_fee:4.5}},expect.any(Object));
  });
});
