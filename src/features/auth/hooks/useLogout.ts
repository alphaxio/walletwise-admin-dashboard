import { useRouter } from "next/navigation";

import { useDispatch } from "react-redux";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { logout } from "../api";
import { toast } from "@/lib/toast";
import { ApiErrorResponse } from "@/lib/types";
import { clearAuthClear } from "@/lib/helpers/cookie";
import { clearUser } from "@/store/features/auth/authSlice";
import { promiseErrorFunction } from "@/lib/helpers/promiseError";

export const useLogout = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      toast.success("Logout successfully");
      clearAuthClear("walletwiseToken");
      dispatch(clearUser());
      queryClient.clear();
      router.push("/");
    },
    onError: (error: ApiErrorResponse) => {
      promiseErrorFunction(error);
    },
  });

  return { isLoggingOut: isPending, logout: () => mutate() };
};
