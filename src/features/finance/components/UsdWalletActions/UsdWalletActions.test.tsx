import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import UsdWalletActions from './UsdWalletActions';
const { mutate } = vi.hoisted(() => ({mutate:vi.fn()}));
vi.mock('../../hooks/useFinancialData', () => ({useFinancialMutation:() => ({mutate,isPending:false})}));
afterEach(cleanup);
beforeEach(() => mutate.mockClear());
describe('USD wallet confirmation actions', () => {
  it.each([['Approve KYC','approve','status','pending_kyc'],['Unfreeze account','unfreeze','freeze','frozen']])('confirms %s without a reason payload', (label,action,endpoint,status) => {
    render(<UsdWalletActions walletId="13" status={status} inline />);
    fireEvent.click(screen.getByRole('button',{name:label}));
    expect(mutate).not.toHaveBeenCalled();
    expect(screen.queryByRole('textbox')).toBeNull();
    fireEvent.click(screen.getByRole('button',{name:'Continue'}));
    expect(mutate).toHaveBeenCalledWith({path:`usd/wallets/13/${endpoint}`,method:'patch',body:{action}},expect.any(Object));
  });
  it.each([['Decline KYC','reject','status'],['Freeze account','freeze','freeze']])('requires a textarea reason for %s', (label,action,endpoint) => {
    render(<UsdWalletActions walletId="13" status="pending_kyc" inline />);
    fireEvent.click(screen.getByRole('button',{name:label}));
    const reason=screen.getByRole('textbox',{name:'Reason'});
    expect(reason.tagName).toBe('TEXTAREA');
    expect((screen.getByRole('button',{name:'Continue'}) as HTMLButtonElement).disabled).toBe(true);
    fireEvent.change(reason,{target:{value:'   '}});
    expect((screen.getByRole('button',{name:'Continue'}) as HTMLButtonElement).disabled).toBe(true);
    fireEvent.change(reason,{target:{value:'  Please upload a recent document.  '}});
    fireEvent.click(screen.getByRole('button',{name:'Continue'}));
    expect(mutate).toHaveBeenCalledWith({path:`usd/wallets/13/${endpoint}`,method:'patch',body:{action,reason:'Please upload a recent document.'}},expect.any(Object));
    expect(screen.getByRole('alertdialog')).toBeTruthy();
  });
  it('declines with fix items and optional notes, without a reason', () => {
    render(<UsdWalletActions walletId="13" status="pending_kyc" inline />);
    fireEvent.click(screen.getByRole('button',{name:'Decline KYC'}));
    const continueButton=screen.getByRole('button',{name:'Continue'}) as HTMLButtonElement;
    expect(continueButton.disabled).toBe(true);
    fireEvent.click(screen.getByRole('checkbox',{name:'Back of ID'}));
    fireEvent.click(screen.getByRole('checkbox',{name:'Home address'}));
    fireEvent.change(screen.getByRole('textbox',{name:'Note for Back of ID'}),{target:{value:'  You uploaded the front twice.  '}});
    expect(continueButton.disabled).toBe(false);
    fireEvent.click(continueButton);
    expect(mutate).toHaveBeenCalledWith({path:'usd/wallets/13/status',method:'patch',body:{action:'reject',items:[{field:'govIdImageBack',note:'You uploaded the front twice.'},{field:'address'}]}},expect.any(Object));
  });
  it('drops an item when it is unticked', () => {
    render(<UsdWalletActions walletId="13" status="pending_kyc" inline />);
    fireEvent.click(screen.getByRole('button',{name:'Decline KYC'}));
    fireEvent.click(screen.getByRole('checkbox',{name:'Proof of address'}));
    fireEvent.click(screen.getByRole('checkbox',{name:'Proof of address'}));
    expect(screen.queryByRole('textbox',{name:'Note for Proof of address'})).toBeNull();
    expect((screen.getByRole('button',{name:'Continue'}) as HTMLButtonElement).disabled).toBe(true);
  });
  it('opens a three-dot dropdown with review and freeze options', async () => {
    const review=vi.fn();
    render(<UsdWalletActions walletId="13" status="active" onReview={review} />);
    fireEvent.keyDown(screen.getByRole('button',{name:'Open row actions'}),{key:'ArrowDown'});
    const item=await screen.findByRole('menuitem',{name:'Review KYC'});
    fireEvent.click(item);
    expect(review).toHaveBeenCalled();
    fireEvent.keyDown(screen.getByRole('button',{name:'Open row actions'}),{key:'ArrowDown'});
    fireEvent.click(await screen.findByRole('menuitem',{name:'Freeze account'}));
    await waitFor(() => expect(screen.getByRole('alertdialog')).toBeTruthy());
  });
});
