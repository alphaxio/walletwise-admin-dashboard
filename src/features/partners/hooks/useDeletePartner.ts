import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/lib/toast";

import { promiseErrorFunction } from "@/lib/helpers/promiseError";
import { ApiErrorResponse } from "@/lib/types";
import { deletePartner } from "../api";

export const useDeletePartner = (afterDelete?: () => void) => {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const onCancel = () => setIsOpen(false);
  const { mutate, isPending } = useMutation({
    mutationFn: deletePartner,
    onSuccess: () => {
      toast.success("Partner deleted.");
      onCancel();
      queryClient.invalidateQueries({ queryKey: ["partners"] });
      afterDelete?.();
    },
    onError: (error: ApiErrorResponse) => {
      promiseErrorFunction(error);
    },
  });

  return {
    isOpen,
    setIsOpen,
    onCancel,
    isPending,
    deletePartner: mutate,
  };
};
