import { FormEvent, useState } from "react";

import { toast } from "@/lib/toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateKycStatus } from "../api/kyc";
import { ApiErrorResponse } from "../types";
import { promiseErrorFunction } from "../helpers/promiseError";

export const useUpdateKycStatus = (kycId: string) => {
  const queryClient = useQueryClient();

  const [openModal, setOpenModal] = useState(false);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  const { mutate, isPending } = useMutation({
    mutationFn: updateKycStatus,
    onSuccess: () => {
      toast.success("Kyc updated successfully!.");
      setMessage("");
      setOpen(false);
      setOpenModal(false);
      queryClient.invalidateQueries({
        queryKey: ["kyc info", kycId],
      });
    },
    onError: (error: ApiErrorResponse) => {
      console.log("error updating kyc status", error);
      promiseErrorFunction(error);
    },
  });

  const handleSubmit = (e: FormEvent, action: "decline" | "approve") => {
    e.preventDefault();
    if (!message) {
      return toast.error("Message is required");
    }
    mutate({ kycId, action, message });
  };

  return {
    openModal,
    setOpenModal,
    open,
    setOpen,
    setMessage,
    message,
    isPending,
    handleSubmit,
  };
};
