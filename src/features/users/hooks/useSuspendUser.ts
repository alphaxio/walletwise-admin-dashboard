import { FormEvent, useState } from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/lib/toast";

import { suspendUser } from "../api";
import { ApiErrorResponse } from "@/lib/types";
import { promiseErrorFunction } from "@/lib/helpers/promiseError";

export const useSuspendUser = (userId: string) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messageContent, setMessage] = useState("");

  const queryClient = useQueryClient();

  const onCancel = () => {
    setIsOpen(false);
  };

  const { mutate, isPending } = useMutation({
    mutationFn: suspendUser,
    onSuccess: () => {
      toast.success("User suspened!");
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

  const handleSubmit = (e: FormEvent, email: string) => {
    e.preventDefault();
    if (!messageContent) {
      toast.error("Please reason for suspension is required");
      return;
    }
    mutate({ email, messageContent });
  };

  return {
    isOpen,
    messageContent,
    setMessage,
    setIsOpen,
    isPending,
    handleSubmit,
  };
};
