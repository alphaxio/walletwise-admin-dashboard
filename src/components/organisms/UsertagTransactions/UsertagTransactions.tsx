"use client";

import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import type { WalletTransaction } from "@/lib/types";
import { canViewTransactions } from "@/lib/helpers/canViewTransactions";

import PageTitle from "@/components/atoms/PageTitle/PageTitle";
import TransactionHistory from "@/components/molecules/TransactionHistory/TransactionHistory";
import TransactionSummary from "@/components/molecules/TransactionSummary/TransactionSummary";

import { useGetUserTagTransactions } from "@/lib/hooks/useGetUserTagTransactions";

const UsertagTransactions = () => {
  const currentAdminId = useSelector((state: RootState) => state.auth.user?.id) || "";
  const {
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
    isLoading,
    handleSearch,
    handleClear,
    currentPage,
    limit,
    refetch,
    handleSortChange,
    setSelectedDateFilterValue,
    setCurrentPage,
  } = useGetUserTagTransactions();

  const visibleTransactions = data?.transactions?.filter(
    (transaction: WalletTransaction) =>
      canViewTransactions(transaction.user?.id || "", currentAdminId),
  );

  return (
    <div className="space-y-6">
      <PageTitle
        title="Usertag Transactions"
        description="Track and manage all usertag transactions"
      />
      <TransactionSummary
        isLoading={isLoading}
        totalTransactions={data?.summary?.total_transactions | 0}
      />
      <TransactionHistory
        data={visibleTransactions}
        isLoading={isLoading}
        totalPages={data?.pagination?.total_pages}
        currentPage={currentPage}
        prevPage={prevPage}
        nextPage={nextPage}
        goToFirstPage={goToFirstPage}
        goToLastPage={goToLastPage}
        isFirstPage={isFirstPage}
        isLastPage={isLastPage}
        limit={limit}
        setLimit={setLimit}
        handleSortChange={handleSortChange}
        refetch={refetch}
        search={search}
        handleChange={handleSearchChange}
        handleClear={handleClear}
        onSubmit={handleSearch}
        setSelectedDateFilterValue={setSelectedDateFilterValue}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};

export default UsertagTransactions;
