import { useState } from "react";

import { toast } from "@/lib/toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { ApiErrorResponse } from "@/lib/types";
import { promiseErrorFunction } from "@/lib/helpers/promiseError";
import { updateRedeemGiftcardStatus } from "../api/giftcard";

export const useUpdateGiftcard = (id: number) => {
  const [openModal, setOpenModal] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [admin_notes, setAdmin_notes] = useState("");

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: updateRedeemGiftcardStatus,
    onSuccess: (data) => {
      toast.success("Giftcard status successfully updated.");
      setOpenModal(false);
      setIsOpenModal(false);
      setAdmin_notes("");
      queryClient.invalidateQueries({
        queryKey: ["redeem gift"],
      });
      queryClient.invalidateQueries({
        queryKey: ["redeem gift info", data?.redemption?.transaction_id],
      });
    },
    onError: (error: ApiErrorResponse) => {
      console.log("error editing data plan", error);
      promiseErrorFunction(error);
    },
  });

  const handleSubmit = (status: "success" | "failed" | "processing") => {
    mutate({ id, status, admin_notes });
  };

  return {
    openModal,
    setOpenModal,
    isOpenModal,
    setIsOpenModal,
    admin_notes,
    setAdmin_notes,
    handleSubmit,
    isPending,
  };
};
