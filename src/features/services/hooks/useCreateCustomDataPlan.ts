import { FormEvent, useState } from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/lib/toast";

import { CreateDataPlanType } from "../types";
import { createCustomDataPlan } from "../api";
import { ApiErrorResponse } from "@/lib/types";
import { promiseErrorFunction } from "@/lib/helpers/promiseError";
import { formatInputTextNumber } from "@/lib/helpers/formatNumbers";
import { formatInputTextNumberWithCommas } from "@/lib/helpers/formatInputTextNumberWithCommas";

export const useCreateCustomDataPlan = () => {
  const [openModal, setOpenModal] = useState(false);
  const [dataPlan, setDataPlan] = useState<CreateDataPlanType>({
    base_plan_id: "",
    fulfillment_quantity: "",
    plan_code: "",
    final_price: "",
  });

  const resetForm = () => {
    setOpenModal(false);
    setDataPlan({
      base_plan_id: "",
      fulfillment_quantity: "",
      plan_code: "",
      final_price: "",
    });
  };

  const queryClient = useQueryClient();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setDataPlan({
      ...dataPlan,
      [name]: ["fulfillment_quantity"].includes(name)
        ? formatInputTextNumber(value)
        : name === "final_price"
          ? formatInputTextNumberWithCommas(value)
          : value,
    });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: createCustomDataPlan,
    onSuccess: () => {
      toast.success("Data plan successfully created.");
      resetForm();
      queryClient.invalidateQueries({
        queryKey: ["data plans"],
      });
    },
    onError: (error: ApiErrorResponse) => {
      console.log("error creating data plan", error);
      promiseErrorFunction(error);
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!dataPlan.base_plan_id) {
      return toast.error("Please select a plan");
    } else if (!dataPlan.fulfillment_quantity) {
      return toast.error("Please enter fulfillment quantuty");
    }
    mutate(dataPlan);
  };

  return {
    dataPlan,
    handleChange,
    isPending,
    handleSubmit,
    openModal,
    setOpenModal,
  };
};
