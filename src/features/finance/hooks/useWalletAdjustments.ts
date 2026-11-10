"use client";

import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { promiseErrorFunction } from "@/lib/helpers/promiseError";
import { ApiErrorResponse } from "@/lib/types";
import { createAdjustment, getAdjustments, getWalletOverview, lookupSession } from "../api/walletAdjustments";
import { formatNaira } from "../helpers/walletAdjustments";
import type { Adjustment, AdjustmentInput, SessionLookup } from "../types/walletAdjustments";

export const useWalletOverview = (identifier: string) =>
  useQuery({
    queryKey: ["wallet overview", identifier],
    queryFn: () => getWalletOverview(identifier),
    enabled: !!identifier,
    retry: false,
  });

export const useSessionLookup = () =>
  useMutation<SessionLookup, ApiErrorResponse, string>({
    mutationFn: lookupSession,
    onError: promiseErrorFunction,
  });

export const useCreateAdjustment = (onDone: () => void, onFailed: () => void) => {
  const queryClient = useQueryClient();
  return useMutation<Adjustment, ApiErrorResponse, AdjustmentInput>({
    mutationFn: createAdjustment,
    onSuccess: (result) => {
      toast.success(
        `Done. ${result.user_email}: ${formatNaira(result.balance_before)} → ${formatNaira(result.balance_after)}`
      );
      queryClient.invalidateQueries({ queryKey: ["wallet overview"] });
      queryClient.invalidateQueries({ queryKey: ["wallet adjustments"] });
      onDone();
    },
    onError: (err) => {
      onFailed();
      promiseErrorFunction(err);
    },
  });
};

export const useAdjustmentHistory = (userEmail: string | undefined, page: number, limit: number) =>
  useQuery({
    queryKey: ["wallet adjustments", userEmail ?? "all", page],
    queryFn: () => getAdjustments({ userEmail, page, limit }),
  });
