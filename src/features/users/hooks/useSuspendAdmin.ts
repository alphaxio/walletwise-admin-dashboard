import { useState } from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/lib/toast";

import { suspendAdmin } from "../api";
import { ApiErrorResponse } from "@/lib/types";
import { promiseErrorFunction } from "@/lib/helpers/promiseError";

export const useSuspendAdmin = () => {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const onCancel = () => {
    setIsOpen(false);
  };

  const { mutate, isPending } = useMutation({
    mutationFn: suspendAdmin,
    onSuccess: (data, variables) => {
      toast.success("Admin suspended!");
      onCancel();
      queryClient.invalidateQueries({
        queryKey: ["admins"],
      });
      queryClient.invalidateQueries({
        queryKey: ["admin info", variables.adminId],
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
    handleSuspendAdmin: mutate,
  };
};
