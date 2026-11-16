import { FormEvent } from "react";
import { useRouter } from "next/navigation";

import { toast } from "@/lib/toast";
import { useMutation } from "@tanstack/react-query";

import { login } from "../api";
import { ApiErrorResponse } from "@/lib/types";
import { useLoginState } from "./useLoginState";
import { promiseErrorFunction } from "@/lib/helpers/promiseError";

export const useLogin = () => {
  const router = useRouter();

  const {
    showPassword,
    togglePasswordVisibility,
    handleChange,
    loginForm,
    resetForm,
  } = useLoginState();

  const { mutate, isPending } = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      resetForm();
      toast.success("Please enter OTP to continue");
      router.push(`/verify?adminId=${data?.adminId}`);
    },
    onError: (error: ApiErrorResponse) => {
      console.log("error logging in", error);
      promiseErrorFunction(error);
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!loginForm.email) {
      return toast.error("Email is required");
    } else if (!loginForm.password) {
      return toast.error("Password is required");
    }
    mutate(loginForm);
  };

  return {
    showPassword,
    togglePasswordVisibility,
    handleChange,
    handleSubmit,
    loginForm,
    isPending,
  };
};
