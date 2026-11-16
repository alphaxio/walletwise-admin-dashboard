import { useState } from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/lib/toast";

import { ApiErrorResponse } from "@/lib/types";
import { promiseErrorFunction } from "@/lib/helpers/promiseError";
import { deleteNotification } from "../api/notification";

export const useDeleteNotification = () => {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const onCancel = () => {
    setIsOpen(false);
  };

  const { mutate, isPending } = useMutation({
    mutationFn: deleteNotification,
    onSuccess: () => {
      toast.success("Notification deleted!");
      onCancel();
      queryClient.invalidateQueries({
        queryKey: ["all notification"],
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
    deleteNotification: mutate,
  };
};
