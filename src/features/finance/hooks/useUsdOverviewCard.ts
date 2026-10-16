"use client";
import { useQuery } from "@tanstack/react-query";
import { fetchList } from "../api";
export function useUsdOverviewCard(metric: "revenue" | "inflow") {
  const query = useQuery({
    queryKey: ["finance", "usd/transactions", "overview-summary"],
    queryFn: ({ signal }) =>
      fetchList(
        "usd/transactions",
        {
          page: 1,
          limit: 1,
          search: "",
          status: "",
          rail: "",
          planType: "",
          userId: "",
        },
        signal,
      ),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
  const raw =
    query.data?.metrics[metric === "inflow" ? "totalVolumeIn" : "totalFees"];
  const value = raw == null || raw === "" ? null : Number(raw);
  return {...query, value};
}
