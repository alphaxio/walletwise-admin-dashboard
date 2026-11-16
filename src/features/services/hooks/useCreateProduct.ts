import { useState } from "react";

import { toast } from "@/lib/toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { promiseErrorFunction } from "@/lib/helpers/promiseError";
import { ApiErrorResponse } from "@/lib/types";
import { createGiftcardProduct } from "../api/giftcard";

export const useCreateProduct = () => {
  const [openModal, setOpenModal] = useState(false);
  const [product, setProduct] = useState({
    asset_id: "",
    country: "",
    currency: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: createGiftcardProduct,
    onSuccess: () => {
      toast.success("Product successfully created");
      setOpenModal(false);
      queryClient.invalidateQueries({
        queryKey: ["giftcard products"],
      });
    },
    onError: (error: ApiErrorResponse) => {
      console.log("error creating giftcard product", error);
      promiseErrorFunction(error);
    },
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();

    const { asset_id, country, currency } = product;
    const payload: {
      asset_id: string;
      country: string;
      currency: string;
    } = {
      asset_id,
      country,
      currency,
    };

    if (!asset_id || !country || !currency) {
      toast.error("Please fill all fields");
      return;
    }

    mutate(payload);
  };

  return {
    openModal,
    setOpenModal,
    product,
    handleChange,
    handleCreate,
    isPending,
  };
};
