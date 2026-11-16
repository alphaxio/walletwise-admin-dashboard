import { ChangeEvent, FormEvent, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/lib/toast";

import { promiseErrorFunction } from "@/lib/helpers/promiseError";
import { ApiErrorResponse } from "@/lib/types";
import { createPartner } from "../api";
import { CreatePartnerPayload } from "../types";

const initialState: CreatePartnerPayload = {
  company_name: "",
  email: "",
  phone_number: "",
  password: "",
};

export const useCreatePartner = () => {
  const [openModal, setOpenModal] = useState(false);
  const [partnerDetails, setPartnerDetails] =
    useState<CreatePartnerPayload>(initialState);
  const [showPassword, setShowPassword] = useState<"text" | "password">(
    "password",
  );
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: createPartner,
    onSuccess: () => {
      toast.success("Partner successfully created.");
      setPartnerDetails(initialState);
      setOpenModal(false);
      queryClient.invalidateQueries({ queryKey: ["partners"] });
    },
    onError: (error: ApiErrorResponse) => {
      promiseErrorFunction(error);
    },
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setPartnerDetails((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (!partnerDetails.company_name.trim()) {
      return toast.error("Company name is required");
    }
    if (!partnerDetails.email.trim()) {
      return toast.error("Email is required");
    }
    if (!partnerDetails.phone_number.trim()) {
      return toast.error("Phone number is required");
    }
    if (!partnerDetails.password.trim()) {
      return toast.error("Password is required");
    }
    if (partnerDetails.password.length < 8) {
      return toast.error("Password must be at least 8 characters");
    }

    mutate(partnerDetails);
  };

  return {
    openModal,
    setOpenModal,
    partnerDetails,
    handleChange,
    handleSubmit,
    isPending,
    isFormFilled: Boolean(
        partnerDetails.company_name.trim() &&
        partnerDetails.email.trim() &&
        partnerDetails.phone_number.trim() &&
        partnerDetails.password.length >= 8,
    ),
    showPassword,
    togglePasswordVisibility: () =>
      setShowPassword((current) =>
        current === "password" ? "text" : "password",
      ),
  };
};
