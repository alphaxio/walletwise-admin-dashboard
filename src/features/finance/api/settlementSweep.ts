import { axiosInstance } from "@/lib/axiosInstance";
import type { SweepRecord, SweepRunInput, SweepRunResponse, SweepScanPage } from "../types/settlementSweep";

const BASE = "/settlement-sweeps";

export const scanSweepAccounts = async (offset: number, limit: number): Promise<SweepScanPage> => {
  // A page reads a few SafeHaven balances; never wait on a stuck request forever.
  const { data } = await axiosInstance.get(`${BASE}/accounts`, { params: { offset, limit }, timeout: 60000 });
  return data?.data;
};

export const runSettlementSweep = async (input: SweepRunInput): Promise<SweepRunResponse> => {
  // Each request moves up to 5 accounts one at a time, so allow it time to finish.
  const { data } = await axiosInstance.post(BASE, input, { timeout: 180000 });
  return data?.data;
};

export const getSettlementSweeps = async (params: { page?: number; limit?: number }) => {
  const { data } = await axiosInstance.get(BASE, { params });
  return data?.data as { items: SweepRecord[]; total: number; page: number; limit: number };
};
