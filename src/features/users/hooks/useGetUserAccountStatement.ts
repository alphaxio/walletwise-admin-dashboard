import { useState } from "react";

import { useMutation } from "@tanstack/react-query";
import { userAccountStatement } from "../api/accountStatement";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { toast } from "@/lib/toast";
import { promiseErrorFunction } from "@/lib/helpers/promiseError";
import { statementPreset, statementRangeLabel } from "../helpers/accountStatement";
import { ApiErrorResponse } from "@/lib/types";

export const useGetUserAccountStatement = (userId = "") => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  const fromDate = dateRange?.from ? format(dateRange.from, "yyyy-MM-dd") : "";
  const toDate = dateRange?.to ? format(dateRange.to, "yyyy-MM-dd") : "";

  const { mutate, reset, isPending, isError, error, isSuccess } = useMutation({
    mutationFn: userAccountStatement,
    onSuccess: (blob, variable) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `statement_${variable.userId}_${variable.startDate}_to_${variable.endDate}.pdf`;
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

  function changeDateRange(range: DateRange | undefined) {
    setDateRange(range);
    reset();
  }
  function selectWeek() { changeDateRange(statementPreset("week")); }
  function selectMonth() { changeDateRange(statementPreset("month")); }
  function selectCurrentMonth() { changeDateRange(statementPreset("currentMonth")); }
  function handleDownload() { downloadStatement(userId); }

  return {
    changeDateRange,
    selectWeek,
    selectMonth,
    selectCurrentMonth,
    handleDownload,
    rangeLabel: statementRangeLabel(dateRange),
    hasCompleteRange: Boolean(dateRange?.from && dateRange?.to),
    dateRange,
    setDateRange,
    downloadStatement,
    isPending,
    isSuccess,
    isError,
    error,
  };
};
