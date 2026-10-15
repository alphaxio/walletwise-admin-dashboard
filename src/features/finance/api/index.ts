import { axiosInstance } from '@/lib/axiosInstance';
import type { ListFilters, RecordData, Resource } from '../types';
import { normalizeUsdWallets } from '../helpers/usdWallets';
import { normalizeUsdTransactions } from '../helpers/usdTransactions';
import { normalizeList, object } from '../helpers/records';
export async function fetchList(resource: Resource, filters: ListFilters, signal?: AbortSignal) {
    const params = Object.fromEntries(Object.entries(filters).filter(([, value]) => value !== ''));
    const endpoint = resource === 'usd/kyc' ? 'usd/wallets' : resource;
    const { data } = await axiosInstance.get(`/${endpoint}`, { params, signal });
    if (resource === 'usd/kyc') return normalizeUsdWallets(data.data);
    return resource === 'usd/transactions' ? normalizeUsdTransactions(data.data) : normalizeList(data.data);
}
export async function fetchRecord(path: string, signal?: AbortSignal): Promise<RecordData> { const endpoint = path.replace(/^usd\/kyc\/([^/]+)$/, 'usd/wallets/$1'); const { data } = await axiosInstance.get(`/${endpoint}`, { signal }); if (!data.data || typeof data.data !== 'object')
    throw new Error('The API returned an unsupported detail response.'); return object(data.data); }
export async function mutateRecord({ path, method, body }: {
    path: string;
    method: 'post' | 'patch' | 'put';
    body: RecordData;
}) { return (await axiosInstance.request({ url: `/${path}`, method, data: body })).data; }
