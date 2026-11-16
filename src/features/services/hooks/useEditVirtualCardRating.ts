import { useEffect, useState } from "react";

import { toast } from "@/lib/toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { ApiErrorResponse } from "@/lib/types";
import { promiseErrorFunction } from "@/lib/helpers/promiseError";
import { formatInputTextNumberWithCommas } from "@/lib/helpers/formatInputTextNumberWithCommas";
import { removeCommas } from "@/lib/helpers/removeCommas";
import { useGetVirtualCardRatingInfo } from "./useGetVirtualCardRatingInfo";
import { editVirtualCardRatingInfo } from "../api/virtualCard";

export const useEditVirtualCardRating = (id: number) => {
  const { ratingInfo, isLoading } = useGetVirtualCardRatingInfo(id);

  const [openModal, setOpenModal] = useState(false);
  const [rating, setRating] = useState({
    rate: null,
    fee: null,
    is_active: undefined,
    provider_rate: null,
    sell_rate: null,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setRating((prev) => ({
      ...prev,
      [name]: ["rate", "fee", "provider_rate", "sell_rate"].includes(name)
        ? formatInputTextNumberWithCommas(value)
        : name === "is_active" && value === "active"
          ? true
          : name === "is_active" && value === "inactive"
            ? false
            : value,
    }));
  };

  useEffect(() => {
    if (ratingInfo && !isLoading) {
      const { rate, fee, is_active, sell_rate, provider_rate } = ratingInfo;
      setRating({ rate, fee, is_active, sell_rate, provider_rate });
    }
  }, [ratingInfo, isLoading]);

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: editVirtualCardRatingInfo,
    onSuccess: () => {
      toast.success("Rating successfully updated.");
      setOpenModal(false);
      queryClient.invalidateQueries({
        queryKey: ["virtual card rating"],
      });
      queryClient.invalidateQueries({
        queryKey: ["virtual card rating info", id],
      });
    },
    onError: (error: ApiErrorResponse) => {
      console.log("error editing data plan", error);
      promiseErrorFunction(error);
    },
  });

  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault();

    const { rate, fee, is_active, sell_rate, provider_rate } = rating;
    const payload: {
      id: number;
      rate?: number;
      fee?: number;
      sell_rate?: number;
      provider_rate?: number;
      is_active?: boolean;
    } = { id };

    if (
      !rate &&
      !fee &&
      !sell_rate &&
      !provider_rate &&
      is_active === undefined
    ) {
      toast.error("Please provide at least one value to update.");
      return;
    }

    if (rate !== null) payload.rate = Number(removeCommas(rate));
    if (fee !== null) payload.fee = Number(removeCommas(fee));
    if (provider_rate !== null)
      payload.provider_rate = Number(removeCommas(provider_rate));
    if (sell_rate !== null) payload.sell_rate = Number(removeCommas(sell_rate));
    if (is_active !== undefined) payload.is_active = is_active;

    mutate(payload);
  };

  return {
    handleEdit,
    openModal,
    setOpenModal,
    handleChange,
    rating,
    isLoading,
    isSubmitting: isPending,
    ratingInfo,
  };
};
