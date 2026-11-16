import { useState } from "react";

import { useMutation } from "@tanstack/react-query";
import { userAccountStatement } from "../api/accountStatement";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { toast } from "@/lib/toast";
import { promiseErrorFunction } from "@/lib/helpers/promiseError";
import { ApiErrorResponse } from "@/lib/types";

export const useGetUserAccountStatement = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  const fromDate = dateRange?.from ? format(dateRange.from, "yyyy-MM-dd") : "";
  const toDate = dateRange?.to ? format(dateRange.to, "yyyy-MM-dd") : "";

  const { mutate, isPending, isError, error, isSuccess } = useMutation({
    mutationFn: userAccountStatement,
    onSuccess: (blob, variable) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `statement_${variable.userId}_${fromDate}_to_${toDate}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    },
    onError: (error: ApiErrorResponse) => {
      promiseErrorFunction(error);
    },
  });

  const downloadStatement = (userId: string) => {
    if (!fromDate) {
      toast.error("Please provide start date");
      return;
    } else if (!toDate) {
      toast.error("Please provide end date");
      return;
    }

    mutate({
      userId,
      startDate: fromDate,
      endDate: toDate,
    });
  };

  return {
    dateRange,
    setDateRange,
    downloadStatement,
    isPending,
    isSuccess,
    isError,
    error,
  };
};
