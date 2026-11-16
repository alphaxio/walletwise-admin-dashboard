import { useState } from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/lib/toast";

import { flagUser } from "../api";
import { ApiErrorResponse } from "@/lib/types";
import { promiseErrorFunction } from "@/lib/helpers/promiseError";

export const useFlagUser = (userId: string) => {
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState("");

  const queryClient = useQueryClient();

  const onCancel = () => {
    setIsOpen(false);
  };

  const { mutate, isPending } = useMutation({
    mutationFn: flagUser,
    onSuccess: () => {
      toast.success("User account updated!");
      onCancel();
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
      queryClient.invalidateQueries({
        queryKey: ["user info", userId],
      });
    },
    onError: (error: ApiErrorResponse) => {
      promiseErrorFunction(error);
    },
  });

  const flagUserAccount = (email: string, flagUser: boolean) => {
    if (flagUser && reason.trim() === "") {
      toast.error("Please provide reason for flagging user account");
    }
    mutate({
      is_suspicious: flagUser,
      reason,
      email,
    });
  };

  return {
    isOpen,
    onCancel,
    setIsOpen,
    flagUserAccount,
    reason,
    setReason,
    isUpdating: isPending,
  };
};
