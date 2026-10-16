"use client";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { fetchList, fetchRecord, mutateRecord } from "../api";
import type { ListFilters, Resource } from "../types";
export function useFinancialList(resource: Resource, userId = "") {
  const [filters, setFilters] = useState<ListFilters>({
    page: 1,
    limit: resource === "usd/kyc" ? 10 : 20,
    search: "",
    status: "",
    rail: "",
    planType: "",
    userId,
  });
  const query = useQuery({
    queryKey: ["finance", resource, filters],
    queryFn: ({ signal }) => fetchList(resource, filters, signal),
    retry: 1,
    staleTime: 30000,
  });
  const update = (changes: Partial<ListFilters>) =>
    setFilters((previous) => ({
      ...previous,
      ...changes,
      page: changes.page ?? 1,
    }));
  return { ...query, filters, update };
}
export function useFinancialRecord(path: string, enabled = true) {
  return useQuery({
    queryKey: ["finance", path],
    queryFn: ({ signal }) => fetchRecord(path, signal),
    enabled,
    retry: 1,
    staleTime: 30000,
  });
}
export function useFinancialMutation() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: mutateRecord,
    onSuccess: async () => {
      await client.invalidateQueries({ queryKey: ["finance"] });
      await client.invalidateQueries({ queryKey: ["savings"] });
      toast.success("Changes saved successfully");
    },
    onError: () =>
      toast.error("The operation failed. Please retry or contact support."),
  });
}
