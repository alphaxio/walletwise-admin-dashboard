"use client";

import { motion } from "framer-motion";
import { ColumnDef } from "@tanstack/react-table";

import { Column } from "./Column";
import { HistoryProps } from "@/lib/types";
import { transferTab } from "@/lib/constants/dateFilter";
import { useAdminPermission } from "@/lib/hooks/useAdminPermission";

import ServiceCardWrapper from "../ServiceCardWrapper/ServiceCardWrapper";
import TableWrapper from "@/components/organisms/TableWrapper/TableWrapper";
import DynamicTabs from "@/components/molecules/DynamicTabs/DynamicTabs";

const ServiceHistory = ({
  statusCount,
  totalRevenue,
  totalCompanyCommission,
  totalTransactions,
  totalUserCommission,
  isLoading,
  onClick,
  data,
  totalPages,
  currentPage,
  prevPage,
  nextPage,
  goToFirstPage,
  goToLastPage,
  isFirstPage,
  isLastPage,
  limit,
  setLimit,
  setSelectedDateFilterValue,
  refetch,
  handleSortChange,
  search,
  handleChange,
  handleClear,
  onSubmit,
  sortOptions,
  service,
  handleSwitchTransferType,
  transferType,
  setCurrentPage,
  totalAmountUsd,
  totalCommissionUsd,
}: HistoryProps) => {
  const { hasPermission } = useAdminPermission();
  const showTransferTab =
    transferType !== undefined && handleSwitchTransferType !== undefined;

  const typedColumns = Column(hasPermission, service) as ColumnDef<unknown>[];
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className="space-y-6"
    >
      <div className="">
        <ServiceCardWrapper
          totalRevenue={totalRevenue}
          totalUserCommission={totalUserCommission}
          totalTransactions={totalTransactions}
          totalCommission={totalCompanyCommission}
          totalAmountUsd={totalAmountUsd}
          totalCommissionUsd={totalCommissionUsd}
          success={statusCount?.success}
          reversed={statusCount?.reversed}
          pending={statusCount?.pending}
          failed={statusCount?.failed}
          loading={isLoading}
          onClick={onClick}
          service={service}
        />
      </div>
      <div className="space-y-2 pt-6">
        {showTransferTab && (
          <DynamicTabs
            urlKey="transferType"
            tabs={transferTab}
            defaultTab={transferType}
            onClick={handleSwitchTransferType}
          />
        )}
        <TableWrapper
          setSelectedDateFilterValue={setSelectedDateFilterValue}
          columns={typedColumns}
          data={data || []}
          totalPages={totalPages}
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
          handleChange={handleChange}
          handleClear={handleClear}
          onSubmit={onSubmit}
          sortOptions={sortOptions}
          setCurrentPage={setCurrentPage}
          isLoading={isLoading}
        />
      </div>
    </motion.div>
  );
};

export default ServiceHistory;
