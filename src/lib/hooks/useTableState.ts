import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createAuthCookie, readAuthCookie } from "../helpers/cookie";
import { DateFilterValue } from "../types";

export const useTableState = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const latestSearchParams = useRef(searchParams);
  latestSearchParams.current = searchParams;

  const savedLimit = readAuthCookie("limit");

  const initialPage = Number(searchParams.get("page")) || 1;
  const initialLimit =
    Number(searchParams.get("limit")) || Number(savedLimit) || 10;
  const initialSearch = searchParams.get("search") || "";
  const initialStatus = searchParams.get("status") || "";
  const initialTab = searchParams.get("tab") || "";
  const initialTransferType = searchParams.get("transferType") || "";
  const initialVirtualTab = searchParams.get("virtualTab") || "";

  const [tier, setTier] = useState<number | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [search, setSearch] = useState(initialSearch);
  const [filter, setFilter] = useState<{ [key: number]: string }>({});
  const [status, setStatus] = useState(initialStatus);
  const [tab, setTab] = useState(initialTab);
  const [virtualTab, setVirtualTab] = useState(initialVirtualTab);
  const [submittedQuery, setSubmittedQuery] = useState<string | null>(null);
  const [selectedDateFilterValue, setSelectedDateFilterValue] =
    useState<DateFilterValue | null>(null);
  const [transferType, setTransferType] = useState(initialTransferType);

  const handleSwitchTransferType = (value: string) => {
    setTransferType(value);
  };

  const handleSwithTab = (tab: string) => {
    setTab(tab);
    setCurrentPage(1);
  };

  const handleSwitchVirtualTab = (tab: string) => {
    setVirtualTab(tab);
    setCurrentPage(1);
  };

  const handleSortChange = (values: { [key: number]: string }): void => {
    setFilter(values);
    setCurrentPage(1);
  };

  const handleStatusChange = (status: string) => {
    setStatus(status);
    setCurrentPage(1);
  };

  const handleTierChange = (tier: number | undefined) => {
    setTier(tier);
    setCurrentPage(1);
  };

  const nextPage = (totalPages: number) => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const goToLastPage = (totalPages: number) => {
    setCurrentPage(totalPages);
  };

  const goToFirstPage = () => {
    setCurrentPage(1);
  };

  const isLastPage = (totalPages: number) => {
    return currentPage === totalPages;
  };

  const isFirstPage = () => {
    return currentPage === 1;
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
  };

  const handleClear = () => {
    setSearch("");
    setSubmittedQuery(null);
  };

  const handleSearch = async () => {
    setCurrentPage(1);
    setSubmittedQuery(search);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setCurrentPage(1);
    createAuthCookie("limit", newLimit.toString());
  };

  const updateUrl = useCallback(() => {
    const params = new URLSearchParams(latestSearchParams.current.toString());

    params.set("page", String(currentPage));
    params.set("limit", String(limit));

    if (tab) params.set("tab", tab);
    else params.delete("tab");

    if (virtualTab) params.set("virtualTab", virtualTab);
    else params.delete("virtualTab");

    if (search) params.set("search", search);
    else params.delete("search");

    if (status) params.set("status", status);
    else params.delete("status");

    if (transferType) params.set("transferType", transferType);
    else params.delete("transferType");

    if (params.toString() !== latestSearchParams.current.toString()) {
      router.replace(`?${params.toString()}`, { scroll: false });
    }
  }, [
    router,
    search,
    limit,
    currentPage,
    status,
    tab,
    virtualTab,
    transferType,
  ]);

  useEffect(() => {
    updateUrl();
  }, [updateUrl]);

  return {
    currentPage,
    limit,
    setLimit: handleLimitChange,
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
    setFilter,
    filter,
    status,
    handleSwithTab,
    tab,
    virtualTab,
    handleSwitchVirtualTab,
    selectedDateFilterValue,
    setSelectedDateFilterValue,
    handleSortChange,
    transferType,
    handleStatusChange,
    handleSwitchTransferType,
    tier,
    handleTierChange,
    setCurrentPage,
  };
};
