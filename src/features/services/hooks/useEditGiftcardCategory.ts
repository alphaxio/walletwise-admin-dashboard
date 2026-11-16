import { useEffect, useState } from "react";

import { toast } from "@/lib/toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { formatInputTextNumberWithCommas } from "@/lib/helpers/formatInputTextNumberWithCommas";
import { promiseErrorFunction } from "@/lib/helpers/promiseError";
import { removeCommas } from "@/lib/helpers/removeCommas";
import { ApiErrorResponse } from "@/lib/types";

import { useGetGiftcardCategoryInfo } from "./useGetGiftcardCategoryInfo";
import { editGifcardCategoryInfo } from "../api/giftcard";
import { numberWithCommas } from "@/lib/helpers";

export const useEditGiftcardCategory = (id: number) => {
  const [openModal, setOpenModal] = useState(false);
  const { categoryInfo, isLoading } = useGetGiftcardCategoryInfo(id, openModal);

  const [category, setCategory] = useState({
    product_id: "",
    name: "",
    rate: "",
    admin_rate: "",
    is_active: undefined,
  });

  const handleSetOpenModal = (open: boolean) => {
    setOpenModal(open);
    if (!open) {
      setCategory({
        product_id: "",
        name: "",
        rate: "",
        admin_rate: "",
        is_active: undefined,
      });
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setCategory((prev) => ({
      ...prev,
      [name]:
        name === "is_active" && value === "active"
          ? true
          : name === "is_active" && value === "inactive"
            ? false
            : name === "rate"
              ? formatInputTextNumberWithCommas(value)
              : value,
    }));
  };

  useEffect(() => {
    if (categoryInfo && !isLoading) {
      const { product_id, name, rate, admin_rate, is_active } = categoryInfo;
      setCategory({
        product_id,
        name,
        rate: numberWithCommas(rate || 0),
        admin_rate: numberWithCommas(admin_rate || 0),
        is_active,
      });
    }
  }, [categoryInfo, isLoading]);

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: editGifcardCategoryInfo,
    onSuccess: () => {
      toast.success("Category successfully updated.");
      setOpenModal(false);
      queryClient.invalidateQueries({
        queryKey: ["giftcard categories"],
      });
      queryClient.invalidateQueries({
        queryKey: ["giftcard category info", id],
      });
    },
    onError: (error: ApiErrorResponse) => {
      console.log("error editing giftcard category", error);
      promiseErrorFunction(error);
    },
  });

  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault();

    const { is_active, name, product_id, rate, admin_rate } = category;
    const payload: {
      is_active?: boolean;
      name?: string;
      rate?: string;
      admin_rate?: string;
      product_id?: string;
      id: number;
    } = { id };

    if (
      !name &&
      !rate &&
      !product_id &&
      is_active === undefined &&
      !admin_rate
    ) {
      toast.error("Please provide at least one value to update.");
      return;
    }

    if (name) payload.name = name;
    if (rate) payload.rate = removeCommas(rate);
    if (admin_rate) payload.admin_rate = removeCommas(admin_rate);
    if (product_id) payload.product_id = product_id;
    if (is_active !== undefined) payload.is_active = is_active;

    mutate(payload);
  };

  return {
    openModal,
    setOpenModal: handleSetOpenModal,
    category,
    handleChange,
    handleEdit,
    isLoading,
    isSubmitting: isPending,
    categoryInfo,
  };
};
