import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { promiseErrorFunction } from "@/lib/helpers/promiseError";
import { ApiErrorResponse } from "@/lib/types";
import { invalidateEventToken } from "../api/events";

export const useInvalidateEventToken = (eventId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ tokenCode }: { tokenCode: string }) =>
      invalidateEventToken({ eventId, tokenCode }),
    onSuccess: (response) => {
      toast.success(response?.message || "Token invalidated successfully");
      queryClient.invalidateQueries({ queryKey: ["event info", eventId] });
    },
    onError: (error: ApiErrorResponse) => promiseErrorFunction(error),
  });
};
