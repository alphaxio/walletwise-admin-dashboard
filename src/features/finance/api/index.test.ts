import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fetchList, fetchRecord } from './index';
import type { ListFilters } from '../types';
const { get } = vi.hoisted(() => ({ get: vi.fn() }));
vi.mock('@/lib/axiosInstance', () => ({ axiosInstance: { get } }));
beforeEach(() => {
  get.mockReset();
  get.mockResolvedValue({data:{data:{wallets:[],pagination:{totalPages:1,totalRecords:0},summary:{}}}});
});
describe('USD KYC wallet listing', () => {
  it('requests the documented wallets endpoint with filters and cancellation', async () => {
    const filters: ListFilters = {page:1,limit:10,status:'pending_kyc',search:'customer-123',rail:'',planType:'',userId:'',startDate:'2026-01-01',endDate:'2026-12-31'};
    const signal = new AbortController().signal;
    const result = await fetchList('usd/kyc',filters,signal);
    expect(get).toHaveBeenCalledWith('/usd/wallets',{params:{page:1,limit:10,status:'pending_kyc',search:'customer-123',startDate:'2026-01-01',endDate:'2026-12-31'},signal});
    expect(result.records).toEqual([]);
  });
  it('omits cleared filters and preserves the accounts endpoint', async () => {
    const filters: ListFilters = {page:1,limit:20,status:'',search:'',rail:'',planType:'',userId:'',startDate:'',endDate:''};
    await fetchList('usd/accounts',filters);
    expect(get).toHaveBeenCalledWith('/usd/accounts',{params:{page:1,limit:20},signal:undefined});
  });
});

describe('USD KYC wallet details', () => {
  it('loads the selected wallet through the supplied detail endpoint', async () => {
    const profile = {id:13,documents:{selfie:'https://example.com/selfie.jpg'}};
    get.mockResolvedValueOnce({data:{data:profile}});
    const signal = new AbortController().signal;
    await expect(fetchRecord('usd/kyc/13',signal)).resolves.toEqual(profile);
    expect(get).toHaveBeenCalledWith('/usd/wallets/13',{signal});
  });
  it('keeps unrelated detail requests on their existing routes', async () => {
    await fetchRecord('usd/accounts/13');
    expect(get).toHaveBeenCalledWith('/usd/accounts/13',{signal:undefined});
  });
});
