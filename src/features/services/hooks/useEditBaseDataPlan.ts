import { FormEvent, useState } from "react";

import { toast } from "@/lib/toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { ApiErrorResponse } from "@/lib/types";
import { promiseErrorFunction } from "@/lib/helpers/promiseError";
import { DataType } from "../types/data";
import { formatInputTextNumberWithCommas } from "@/lib/helpers/formatInputTextNumberWithCommas";
import { editBaseDataPlan } from "../api/dataPlan";
import { removeCommas } from "@/lib/helpers/removeCommas";

export const useEditBaseDataPlan = (id: number) => {
  const [openModal, setOpenModal] = useState(false);
  const [baseData, setBaseData] = useState<DataType>({
    cost: "",
    final_price: "",
    commission: "",
    is_active: undefined,
  });

  const handleBaseChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setBaseData((prev) => ({
      ...prev,
      [name]:
        name === "is_active" && value === "active"
          ? true
          : name === "is_active" && value === "inactive"
            ? false
            : formatInputTextNumberWithCommas(value),
    }));
  };

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: editBaseDataPlan,
    onSuccess: () => {
      toast.success("Data plan successfully updated.");
      setOpenModal(false);
      queryClient.invalidateQueries({
        queryKey: ["data plans"],
      });
    },
    onError: (error: ApiErrorResponse) => {
      console.log("error editing data plan", error);
      promiseErrorFunction(error);
    },
  });

  const handleBaseEdit = (e: FormEvent) => {
    e.preventDefault();
    const { is_active, commission, final_price, cost } = baseData;
    if (is_active === undefined && !commission && !cost && !final_price) {
      toast.error("Please edit at least one field before submitting");
      return;
    }
    mutate({
      is_active,
      id,
      commission: removeCommas(commission),
      final_price: removeCommas(final_price),
      cost: removeCommas(cost),
    });
  };

  return {
    handleBaseEdit,
    openModal,
    setOpenModal,
    baseData,
    setBaseData,
    handleBaseChange,
    isUpdating: isPending,
  };
};
