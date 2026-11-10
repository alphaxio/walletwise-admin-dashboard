import { axiosInstance } from "@/lib/axiosInstance";
import type { Adjustment, AdjustmentInput, SessionLookup, WalletOverview } from "../types/walletAdjustments";

const BASE = "/wallet-adjustments";

export const getWalletOverview = async (identifier: string): Promise<WalletOverview> => {
  const { data } = await axiosInstance.get(`${BASE}/users/${encodeURIComponent(identifier.trim())}`);
  return data?.data;
};

export const lookupSession = async (sessionId: string): Promise<SessionLookup> => {
  const { data } = await axiosInstance.get(`${BASE}/session/${encodeURIComponent(sessionId.trim())}`);
  return data?.data;
};

export const createAdjustment = async (input: AdjustmentInput): Promise<Adjustment> => {
  const { data } = await axiosInstance.post(BASE, input);
  return data?.data;
};

export const getAdjustments = async (params: { userEmail?: string; page?: number; limit?: number }) => {
  const { data } = await axiosInstance.get(BASE, { params });
  return data?.data as { items: Adjustment[]; total: number; page: number; limit: number };
};
