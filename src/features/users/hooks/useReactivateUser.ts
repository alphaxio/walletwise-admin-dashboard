import { FormEvent, useState } from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/lib/toast";

import { reactivateUser } from "../api";
import { ApiErrorResponse } from "@/lib/types";
import { promiseErrorFunction } from "@/lib/helpers/promiseError";

export const useReactivateUser = (userId: string) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messageContent, setMessage] = useState("");

  const queryClient = useQueryClient();

  const onCancel = () => {
    setIsOpen(false);
  };

  const { mutate, isPending } = useMutation({
    mutationFn: reactivateUser,
    onSuccess: () => {
      toast.success("User reactivated!");
      onCancel();
      queryClient.invalidateQueries({
        queryKey: ["admins"],
      });
      queryClient.invalidateQueries({
        queryKey: ["user info", userId],
      });
    },
    onError: (error: ApiErrorResponse) => {
      promiseErrorFunction(error);
    },
  });

  const handleSubmit = (e: FormEvent, email: string) => {
    e.preventDefault();
    if (!messageContent) {
      toast.error("Please reason for user reactivation is required");
      return;
    }
    mutate({ email, messageContent });
  };

  return {
    open: isOpen,
    msg: messageContent,
    setMsg: setMessage,
    setOpen: setIsOpen,
    isReactivating: isPending,
    handleReactivate: handleSubmit,
  };
};
