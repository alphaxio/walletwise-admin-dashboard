import { useState } from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/lib/toast";

import { deleteAdmin } from "../api";
import { ApiErrorResponse } from "@/lib/types";
import { promiseErrorFunction } from "@/lib/helpers/promiseError";

export const useDeleteAdmin = () => {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const onCancel = () => {
    setIsOpen(false);
  };

  const { mutate, isPending } = useMutation({
    mutationFn: deleteAdmin,
    onSuccess: (data, variables) => {
      toast.success("Admin deleted!");
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
    deleteAdmin: mutate,
  };
};
