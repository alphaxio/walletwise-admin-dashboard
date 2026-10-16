import { useQuery } from "@tanstack/react-query";

import { useTableState } from "@/lib/hooks/useTableState";
import { getSavings } from "../api/savings";

export const useGetSavings = () => {
  const {
    currentPage,
    limit,
    setLimit,
    nextPage,
    prevPage,
    goToFirstPage,
    goToLastPage,
    isFirstPage,
    isLastPage,
    search,
    handleSearchChange,
    handleClear,
    submittedQuery,
    handleSearch,
    status,
    filter,
    handleSwithTab,
    tab,
    selectedDateFilterValue,
    setSelectedDateFilterValue,
    handleSortChange,
    handleStatusChange,
    setCurrentPage,
  } = useTableState();

  const { data, isPending, isLoading, isError, error, refetch } = useQuery({
    queryKey: [
      "savings",
      submittedQuery,
      limit,
      currentPage,
      status,
      selectedDateFilterValue,
      filter,
    ],
    queryFn: () =>
      getSavings({
        currentPage,
        limit,
        search: submittedQuery,
        status,
        filter,
        selectedDateFilterValue,
      }),
    enabled: true,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  return {
    setLimit,
    nextPage,
    prevPage,
    goToFirstPage,
    goToLastPage,
    isFirstPage,
    isLastPage,
    search,
    handleSearchChange,
    data,
    isPending,
    isLoading,
    isError,
    error,
    handleSearch,
    handleClear,
    currentPage,
    limit,
    refetch,
    filter,
    handleSwithTab,
    tab,
    handleSortChange,
    setSelectedDateFilterValue,
    handleStatusChange,
    setCurrentPage,
  };
};
