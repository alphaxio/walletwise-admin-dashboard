import { useQuery } from "@tanstack/react-query";

import { getSavingsInfo } from "../api/savings";

export const useGetSavingsInfo = (id: string) => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["savings transaction info", id],
    queryFn: () => getSavingsInfo({ id }),
    enabled: true,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  return {
    data,
    isLoading,
    isError,
    refetch,
  };
};
