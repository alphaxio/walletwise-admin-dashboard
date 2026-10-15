import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import FinancialList from './FinancialList';
const {update,refetch} = vi.hoisted(() => ({update:vi.fn(),refetch:vi.fn()}));
vi.mock('../../hooks/useFinancialData', () => ({
  useFinancialList:() => ({filters:{page:1,limit:10,status:'',search:'',rail:'',planType:'',userId:''},update,refetch,isPending:false,isError:false,data:{total:20,totalPages:2,metrics:{totalAccounts:20,frozen:3},records:[{id:7,status:'pending_kyc',createdAt:'2026-06-15T18:43:27+01:00',user:{name:'Ada Example',email:'ada@example.com',tag:'ada'},threatStatus:'critical',restrictionStatus:'none',balance:'0.00'}]}}),
  useFinancialMutation:() => ({mutate:vi.fn(),isPending:false}),
}));
vi.mock('@/features/users/components/UserProfileLink/UserProfileLink', () => ({default:({name}:{name:string}) => <span>{name}</span>}));
vi.mock('../FinancialDetail/FinancialDetail', () => ({default:({record}:{record:{id:number}}) => <p>Selected wallet {record.id}</p>}));
afterEach(cleanup);
beforeEach(() => {update.mockClear();refetch.mockClear();});
describe('composed financial list', () => {
  it('preserves summary filtering, formatted cells, search and pagination', () => {
    render(<FinancialList resource="usd/kyc" />);
    expect(screen.getAllByRole('columnheader')[0].textContent).toBe('Created');
    expect(screen.getByText('Pending')).toBeTruthy();
    expect(screen.getByText('critical').className).toContain('bg-red-500/10');
    expect(screen.queryByRole('combobox',{name:'Status'})).toBeNull();
    fireEvent.click(screen.getByRole('button',{name:/Frozen/}));
    expect(update).toHaveBeenLastCalledWith({status:'frozen'});
    const search=screen.getByPlaceholderText('Search name, email, user tag or Miden customer ID');
    fireEvent.change(search,{target:{value:'Ada'}});
    fireEvent.submit(search.closest('form')!);
    expect(update).toHaveBeenLastCalledWith({search:'Ada'});
    fireEvent.click(screen.getByRole('button',{name:'Go to next page'}));
    expect(update).toHaveBeenLastCalledWith({page:2});
    fireEvent.click(screen.getByRole('button',{name:'Clear filters'}));
    expect(update).toHaveBeenLastCalledWith({search:'',status:'',rail:'',planType:'',startDate:'',endDate:''});
  });
  it('opens KYC details through the row menu', async () => {
    render(<FinancialList resource="usd/kyc" />);
    fireEvent.keyDown(screen.getByRole('button',{name:'Open row actions'}),{key:'ArrowDown'});
    fireEvent.click(await screen.findByRole('menuitem',{name:'Review KYC'}));
    expect(screen.getByText('Selected wallet 7')).toBeTruthy();
  });
});
