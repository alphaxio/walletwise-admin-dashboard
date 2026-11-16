import { FormEvent, useState } from "react";

import { toast } from "@/lib/toast";
import { useMutation } from "@tanstack/react-query";

import { forgotPassword } from "../api";
import { ApiErrorResponse } from "@/lib/types";
import { promiseErrorFunction } from "@/lib/helpers/promiseError";

export const useForgotPassword = () => {
  const [email, setEmail] = useState("");

  const { mutate, isPending } = useMutation({
    mutationFn: forgotPassword,
    onSuccess: () => {
      toast.success(
        "If you have an account, a reset password link has been sent to your email."
      );
    },
    onError: (error: ApiErrorResponse) => {
      console.log("error logging in", error);
      promiseErrorFunction(error);
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email.");
      return;
    }
    mutate({ email });
  };

  return {
    email,
    setEmail,
    handleSubmit,
    isPending,
  };
};
