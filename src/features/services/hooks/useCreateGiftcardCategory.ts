import { useState } from "react";

import { toast } from "@/lib/toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { formatInputTextNumberWithCommas } from "@/lib/helpers/formatInputTextNumberWithCommas";
import { promiseErrorFunction } from "@/lib/helpers/promiseError";
import { removeCommas } from "@/lib/helpers/removeCommas";
import { ApiErrorResponse } from "@/lib/types";
import { createGiftcardCategory } from "../api/giftcard";

export const useCreateGiftcardCategory = () => {
  const [openModal, setOpenModal] = useState(false);
  const [category, setCategory] = useState({
    product_id: "",
    name: "",
    rate: "",
    admin_rate: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setCategory((prev) => ({
      ...prev,
      [name]: ["rate", "admin_rate"].includes(name)
        ? formatInputTextNumberWithCommas(value)
        : value,
    }));
  };

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: createGiftcardCategory,
    onSuccess: () => {
      toast.success("Category successfully created");
      setOpenModal(false);
      queryClient.invalidateQueries({
        queryKey: ["giftcard categories"],
      });
    },
    onError: (error: ApiErrorResponse) => {
      console.log("error creating giftcard category", error);
      promiseErrorFunction(error);
    },
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();

    const { name, product_id, rate, admin_rate } = category;
    const payload: {
      name: string;
      rate: string;
      admin_rate: string;
      product_id: string;
    } = {
      name,
      rate: removeCommas(rate),
      product_id,
      admin_rate: removeCommas(admin_rate),
    };

    if (!name || !rate || !product_id) {
      toast.error("Please fill all fields");
      return;
    }

    mutate(payload);
  };

  return {
    openModal,
    setOpenModal,
    category,
    handleChange,
    handleCreate,
    isPending,
  };
};
