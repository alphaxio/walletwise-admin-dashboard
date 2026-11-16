import { toast } from "@/lib/toast";
import { ApiErrorResponse } from "../types";

export const promiseErrorFunction = (error: ApiErrorResponse) => {
  const { response } = error || {};
  const { data } = response || {};
  const { errors, message } = data || {};

  if (Array.isArray(errors) && errors.length > 0 && errors[0]?.message) {
    return toast.error(errors[0].message);
  }

  if (message) {
    return toast.error(message);
  }

  return toast.error("Internal Server Error! Please contact support.");
};
