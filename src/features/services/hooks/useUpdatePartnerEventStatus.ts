import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/lib/toast";

import { promiseErrorFunction } from "@/lib/helpers/promiseError";
import { ApiErrorResponse } from "@/lib/types";
import { updatePartnerEventStatus } from "../api/events";

export const useUpdatePartnerEventStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePartnerEventStatus,
    onSuccess: (response, variables) => {
      toast.success(
        response?.message ||
          `Event ${variables.status.toLowerCase()} successfully`,
      );
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["partner info"] });
      queryClient.invalidateQueries({
        queryKey: ["event info", variables.eventId],
      });
    },
    onError: (error: ApiErrorResponse) => {
      promiseErrorFunction(error);
    },
  });
};
