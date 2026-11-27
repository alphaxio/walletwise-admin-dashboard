import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { toast } from "@/lib/toast";

import { getKillSwitchStatus, lockKillSwitch } from "../api/killSwitch";
import { promiseErrorFunction } from "../helpers/promiseError";
import { ApiErrorResponse } from "../types";

export const KILL_SWITCH_QUERY_KEY = ["kill switch status"];

export const useKillSwitchStatus = () =>
  useQuery({
    queryKey: KILL_SWITCH_QUERY_KEY,
    queryFn: getKillSwitchStatus,
    refetchInterval: 15_000,
    refetchOnWindowFocus: true,
    retry: false,
  });

export const useLockKillSwitch = (onDone?: () => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: lockKillSwitch,
    onSuccess: (data) => {
      toast.success(data?.message || "Emergency lock is on.");
      queryClient.invalidateQueries({ queryKey: KILL_SWITCH_QUERY_KEY });
      onDone?.();
    },
    onError: (error: ApiErrorResponse) => {
      promiseErrorFunction(error);
    },
  });
};
