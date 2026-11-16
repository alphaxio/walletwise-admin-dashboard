import { ChangeEvent, FormEvent, useMemo, useState } from "react";

import { toast } from "@/lib/toast";
import { useMutation } from "@tanstack/react-query";

import { changePassword } from "../api";
import { ApiErrorResponse } from "@/lib/types";
import { promiseErrorFunction } from "@/lib/helpers/promiseError";
import { validatePassword } from "../helpers/validatePassword";

export const useChangePassword = () => {
  const [showPassword, setShowPassword] = useState<"text" | "password">(
    "password"
  );
  const [password, setPassword] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => (prev === "password" ? "text" : "password"));
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPassword({
      ...password,
      [name]: value,
    });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      setPassword({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      toast.success("Password changed successfully");
    },
    onError: (error: ApiErrorResponse) => {
      promiseErrorFunction(error);
    },
  });

  const validations = useMemo(
    () => validatePassword(password?.newPassword),
    [password?.newPassword]
  );
  const isValid = useMemo(
    () => Object.values(validations).every(Boolean),
    [validations]
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const { oldPassword, newPassword, confirmPassword } = password;
    if (!oldPassword) {
      return toast.error("Old Password is required");
    } else if (!newPassword) {
      toast.error("New Password is required");
      return;
    } else if (!isValid)
      return toast.error(
        "Weak password! Follow the guidelines to strengthen it."
      );
    else if (confirmPassword !== newPassword) {
      return toast.error("Confirm password does not match new password");
    }
    mutate(password);
  };

  return {
    password,
    handleChange,
    showPassword,
    togglePasswordVisibility,
    handleSubmit,
    isPending,
    validations,
  };
};
