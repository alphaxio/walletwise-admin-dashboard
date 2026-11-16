import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/lib/toast";

import { promiseErrorFunction } from "@/lib/helpers/promiseError";
import { ApiErrorResponse } from "@/lib/types";
import { validatePartnerTicket } from "../api/events";

export const useValidatePartnerTicket = (eventId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: validatePartnerTicket,
    onSuccess: (response) => {
      toast.success(response?.message || "Ticket invalidated successfully");
      queryClient.invalidateQueries({
        queryKey: ["partner event tickets", eventId],
      });
    },
    onError: (error: ApiErrorResponse) => {
      promiseErrorFunction(error);
    },
  });
};
