import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { toast } from "@/lib/toast";
import { useMutation } from "@tanstack/react-query";

import { resetPassword } from "../api";
import { ApiErrorResponse } from "@/lib/types";
import { promiseErrorFunction } from "@/lib/helpers/promiseError";

export const useResetPassword = () => {
  const router = useRouter();

  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState<"text" | "password">(
    "password"
  );

  const token = searchParams.get("token") || "";

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => (prev === "password" ? "text" : "password"));
  };

  const { mutate, isPending } = useMutation({
    mutationFn: resetPassword,
    onSuccess: () => {
      setConfirmPassword("");
      setPassword("");
      toast.success("Reset password successful");
      router.push("/login");
    },
    onError: (error: ApiErrorResponse) => {
      console.log("error resetting password", error);
      promiseErrorFunction(error);
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!password) {
      return toast.error("Password is required");
    } else if (confirmPassword !== password) {
      return toast.error("Confirm password does not match password");
    }
    mutate({ token, password });
  };

  return {
    handleSubmit,
    isPending,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    showPassword,
    togglePasswordVisibility,
  };
};
