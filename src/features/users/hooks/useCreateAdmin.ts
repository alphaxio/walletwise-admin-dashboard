import { FormEvent } from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/lib/toast";

import { ApiErrorResponse } from "@/lib/types";
import { createAdmin } from "../api";
import { useCreateAdminState } from "./useCreateAdminState";
import { promiseErrorFunction } from "@/lib/helpers/promiseError";

export const useCreateAdmin = () => {
  const queryClient = useQueryClient();

  const {
    handleChange,
    resetForm,
    openModal,
    setOpenModal,
    adminDetails,
    isFormFilled,
    togglePasswordVisibility,
    showPassword,
  } = useCreateAdminState();

  const { mutate, isPending } = useMutation({
    mutationFn: createAdmin,
    onSuccess: () => {
      toast.success("Admin successfully created.");
      resetForm();
      queryClient.invalidateQueries({
        queryKey: ["admins"],
      });
    },
    onError: (error: ApiErrorResponse) => {
      console.log("error creating admin", error);
      promiseErrorFunction(error);
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!adminDetails.firstName) {
      return toast.error("First name is required");
    } else if (!adminDetails.lastName) {
      return toast.error("Last name is required");
    } else if (!adminDetails.email) {
      return toast.error("Email is required");
    } else if (!adminDetails.role) {
      return toast.error("Role is required");
    } else if (!adminDetails.phoneNumber) {
      return toast.error("Phone number is required");
    } else if (!adminDetails.gender) {
      return toast.error("Gender is required");
    } else if (!adminDetails.password) {
      return toast.error("Password is required");
    }
    mutate(adminDetails);
  };

  return {
    handleChange,
    handleSubmit,
    isPending,
    openModal,
    setOpenModal,
    isFormFilled,
    togglePasswordVisibility,
    showPassword,
    adminDetails,
  };
};
