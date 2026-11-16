import { useState } from "react";

import { toast } from "@/lib/toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteDataPlan } from "../api";
import { ApiErrorResponse } from "@/lib/types";
import { promiseErrorFunction } from "@/lib/helpers/promiseError";

export const useDeleteDataPlan = () => {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const onCancel = () => {
    setIsOpen(false);
  };

  const { mutate, isPending } = useMutation({
    mutationFn: deleteDataPlan,
    onSuccess: () => {
      toast.success("Data plan deleted!");
      onCancel();
      queryClient.invalidateQueries({
        queryKey: ["data plans"],
      });
    },
    onError: (error: ApiErrorResponse) => {
      promiseErrorFunction(error);
    },
  });

  return {
    isOpen,
    onCancel,
    isPending,
    setIsOpen,
    deleteDataPlan: mutate,
  };
};
