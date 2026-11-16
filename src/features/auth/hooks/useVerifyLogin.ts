import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { toast } from "@/lib/toast";
import { useDispatch } from "react-redux";
import { useMutation } from "@tanstack/react-query";

import { verifyLogin } from "../api";
import { ApiErrorResponse } from "@/lib/types";
import { createAuthCookie } from "@/lib/helpers/cookie";
import { setUser } from "@/store/features/auth/authSlice";
import { promiseErrorFunction } from "@/lib/helpers/promiseError";
import {
  isRestrictedEventAdmin,
  RESTRICTED_EVENT_PATH,
} from "../constants/restrictedAccess";

export const useVerifyLogin = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [otp, setOtp] = useState("");

  const adminId = searchParams.get("adminId") || "";

  const dispatch = useDispatch();

  const { mutate, isPending } = useMutation({
    mutationFn: verifyLogin,
    onSuccess: (data) => {
      const { adminDetails, token } = data;
      createAuthCookie("walletwiseToken", token);
      dispatch(setUser(adminDetails));
      toast.success("Login success");
      router.push(
        isRestrictedEventAdmin(adminDetails?.id)
          ? RESTRICTED_EVENT_PATH
          : "/overview",
      );
    },
    onError: (error: ApiErrorResponse) => {
      console.log("error logging in", error);
      promiseErrorFunction(error);
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!otp) {
      toast.error("Please enter otp sent to your mail");
      return;
    }
    mutate({ otp, adminId });
  };

  return {
    otp,
    setOtp,
    handleSubmit,
    isPending,
  };
};
