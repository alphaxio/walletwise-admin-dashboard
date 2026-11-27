import { axiosInstance } from "../axiosInstance";

export type KillSwitchStatus = {
  configured: boolean;
  locked: boolean;
  level: 0 | 1 | 2;
  unknown: boolean;
  reason: string | null;
  by: string | null;
  since: string | null;
  canLock: boolean;
};

export const getKillSwitchStatus = async (): Promise<KillSwitchStatus> => {
  const { data } = await axiosInstance.get("/kill-switch/status");
  return data?.data;
};

export const lockKillSwitch = async ({ level, reason }: { level: 1 | 2; reason: string }) => {
  const { data } = await axiosInstance.post("/kill-switch/lock", { level, reason });
  return data;
};
