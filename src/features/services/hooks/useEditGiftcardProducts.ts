import { useEffect, useState } from "react";
import { useGetGiftcardProductInfo } from "./useGetGiftcardProductInfo";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiErrorResponse } from "@/lib/types";
import { promiseErrorFunction } from "@/lib/helpers/promiseError";
import { toast } from "@/lib/toast";
import { editGifcardProductInfo } from "../api/giftcard";

export const useEditGiftcardProducts = (id: number) => {
  const { productInfo, isLoading } = useGetGiftcardProductInfo(id);

  const [openModal, setOpenModal] = useState(false);
  const [product, setProduct] = useState({
    asset_id: "",
    country: "",
    currency: "",
    is_active: undefined,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]:
        name === "is_active" && value === "active"
          ? true
          : name === "is_active" && value === "inactive"
            ? false
            : value,
    }));
  };

  useEffect(() => {
    if (productInfo && !isLoading) {
      const { asset_id, country, currency, is_active } = productInfo;
      setProduct({ asset_id, country, currency, is_active });
    }
  }, [productInfo, isLoading]);

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: editGifcardProductInfo,
    onSuccess: () => {
      toast.success("Product successfully updated.");
      setOpenModal(false);
      queryClient.invalidateQueries({
        queryKey: ["giftcard products"],
      });
      queryClient.invalidateQueries({
        queryKey: ["giftcard product info", id],
      });
    },
    onError: (error: ApiErrorResponse) => {
      console.log("error editing giftcard product", error);
      promiseErrorFunction(error);
    },
  });

  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault();

    const { is_active, country, currency, asset_id } = product;
    const payload: {
      is_active?: boolean;
      country?: string;
      currency?: string;
      asset_id?: string;
      id: number;
    } = { id };

    if (!country && !currency && !asset_id && is_active === undefined) {
      toast.error("Please provide at least one value to update.");
      return;
    }

    if (country) payload.country = country;
    if (currency) payload.currency = currency;
    if (asset_id) payload.asset_id = asset_id;
    if (is_active !== undefined) payload.is_active = is_active;

    mutate(payload);
  };

  return {
    openModal,
    setOpenModal,
    product,
    handleChange,
    handleEdit,
    isLoading,
    isSubmitting: isPending,
    productInfo,
  };
};
