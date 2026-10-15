"use client";

import FinancialList from '@/features/finance/components/FinancialList/FinancialList';
import RateSettings from '@/features/finance/components/RateSettings/RateSettings';
import RequestState from '@/features/finance/components/RequestState/RequestState';
import { AnimatePresence } from "framer-motion";

import { useGetSavings } from "../../hooks/useGetSavings";

import ServiceLayout from "@/components/templates/ServiceLayout/ServiceLayout";
import SavingsSummaryWrapper from "../SavingsSummaryWrapper/SavingsSummaryWrapper";
import SavingsTable from "../SavingsTable/SavingsTable";
import { savingsSortOptions } from "@/lib/constants/dateFilter";

const SavingsWrapper = () => {
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
    isError,
    handleSearch,
    handleClear,
    currentPage,
    limit,
    refetch,
    handleSwithTab,
    handleSortChange,
    setSelectedDateFilterValue,
    handleStatusChange,
    setCurrentPage,
  } = useGetSavings();

  const tabs = [
    {
      value: "history",
      label: "History",
      content: (
        <AnimatePresence>
          <div className="">
            <RequestState pending={false} error={isError} retry={() => refetch()} />
            <SavingsSummaryWrapper
              loading={isLoading}
              totalRevenue={data?.metrics?.amounts_saved?.total_combined}
              flexCount={data?.metrics?.accounts_count?.flex}
              flexRevenue={data?.metrics?.amounts_saved?.flex}
              lockCount={data?.metrics?.accounts_count?.lock}
              lockRevenue={data?.metrics?.amounts_saved?.lock}
              goalCount={data?.metrics?.accounts_count?.goal}
              goalRevenue={data?.metrics?.amounts_saved?.goal}
              ajoCount={data?.metrics?.accounts_count?.ajo}
              ajoRevenue={data?.metrics?.amounts_saved?.ajo}
              onClick={handleStatusChange}
            />
            <SavingsTable
              setSelectedDateFilterValue={setSelectedDateFilterValue}
              statusCount={data?.status_counts}
              totalRevenue={data?.total_amount}
              totalTransactions={data?.total_count}
              totalCompanyCommission={data?.total_company_commission}
              totalUserCommission={data?.total_user_commission}
              isLoading={isLoading}
              onClick={handleStatusChange}
              data={data?.transactions}
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
              setCurrentPage={setCurrentPage}
              sortOptions={savingsSortOptions}
              service="savings"
            />
          </div>
        </AnimatePresence>
      ),
    },
    {value: 'plans', label: 'Active Plans', content: <FinancialList resource="savings/plans" />},
    {value: 'rates', label: 'Interest Rates & Rules', content: <RateSettings type="savings" />},
    {value: 'accruals', label: 'Interest Accrual & Audit', content: <FinancialList resource="savings/accruals" />},
  ];

  return (
    <ServiceLayout
      title="Savings"
      tabs={tabs}
      defaultTab={"history"}
      onClick={handleSwithTab}
    />
  );
};

export default SavingsWrapper;
