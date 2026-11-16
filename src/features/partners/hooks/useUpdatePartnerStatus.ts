import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/lib/toast";

import { promiseErrorFunction } from "@/lib/helpers/promiseError";
import { ApiErrorResponse } from "@/lib/types";
import { activatePartner, deactivatePartner } from "../api";

export const useUpdatePartnerStatus = (
  partnerId: string,
  shouldActivate: boolean,
) => {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: shouldActivate ? activatePartner : deactivatePartner,
    onSuccess: () => {
      toast.success(
        `Partner ${shouldActivate ? "activated" : "deactivated"}.`,
      );
      setIsOpen(false);
      queryClient.invalidateQueries({
        queryKey: ["partner info", partnerId],
      });
      queryClient.invalidateQueries({ queryKey: ["partners"] });
    },
    onError: (error: ApiErrorResponse) => {
      promiseErrorFunction(error);
    },
  });

  return {
    isOpen,
    setIsOpen,
    onCancel: () => setIsOpen(false),
    isPending: mutation.isPending,
    updateStatus: () => mutation.mutate({ partnerId }),
  };
};
