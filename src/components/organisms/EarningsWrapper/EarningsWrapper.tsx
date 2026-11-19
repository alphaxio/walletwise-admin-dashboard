"use client";

import PageTitle from "@/components/atoms/PageTitle/PageTitle";
import DynamicTabs from "@/components/molecules/DynamicTabs/DynamicTabs";
import ServiceEarningsSummary from "../ServiceEarningsSummary/ServiceEarningsSummary";

import { useGetEarnings } from "@/lib/hooks/useGetEarnings";

const EarningsWrapper = () => {
  const {
    setLimit,
    nextPage,
    prevPage,
    goToFirstPage,
    goToLastPage,
    isFirstPage,
    isLastPage,
    data,
    isLoading,
    currentPage,
    limit,
    setSelectedDateFilterValue,
    handleSwithTab,
    tab,
    setCurrentPage,
  } = useGetEarnings();

  const totalRevenue = data?.overall?.total_revenue || 0;
  const totalInappRevenue = data?.overall?.total_inapp_revenue ?? 0;
  const totalProfit = data?.overall?.total_profit || 0;

  const content = (
    <ServiceEarningsSummary
      data={data?.data || []}
      totalPages={data?.pagination?.total_pages}
      totalRevenue={totalRevenue}
      totalProfit={totalProfit}
      totalInappRevenue={totalInappRevenue}
      isLoading={isLoading}
      currentPage={currentPage}
      prevPage={prevPage}
      nextPage={nextPage}
      goToFirstPage={goToFirstPage}
      goToLastPage={goToLastPage}
      isFirstPage={isFirstPage}
      isLastPage={isLastPage}
      limit={limit}
      setLimit={setLimit}
      setSelectedDateFilterValue={setSelectedDateFilterValue}
      setCurrentPage={setCurrentPage}
    />
  );

  const earningsTab = [
    {
      label: "All",
      value: "",
      content,
    },
    {
      label: "Airtime",
      value: "airtime",
      content,
    },
    {
      label: "Betting",
      value: "betting",
      content,
    },
    {
      label: "Cable",
      value: "cable",
      content,
    },
    {
      label: "Card creation",
      value: "card-creation",
      content,
    },
    {
      label: "Card topup",
      value: "card-topup",
      content,
    },
    {
      label: "Card refund",
      value: "card-refund",
      content,
    },
    {
      label: "Card withdrawal",
      value: "card-withdrawal",
      content,
    },
    {
      label: "Data",
      value: "data",
      content,
    },
    {
      label: "Education",
      value: "education",
      content,
    },
    {
      label: "Electricity",
      value: "electricity",
      content,
    },
    {
      label: "E-Sim",
      value: "esim",
      content,
    },

    {
      label: "Gift Cards",
      value: "giftcard",
      content,
    },
    {
      label: "Gift Redeem",
      value: "gift-redeem",
      content,
    },

    {
      label: "Transfer",
      value: "transfer",
      content,
    },
    // {
    //   label: "Virtual Card",
    //   value: "virtual-card",
    //   content,
    // },
  ];

  return (
    <div className="space-y-6">
      <PageTitle
        title="Earnings"
        description="Track and manage company's earnings here"
      />
      <DynamicTabs
        tabs={earningsTab}
        defaultTab={tab}
        onClick={handleSwithTab}
      />
    </div>
  );
};

export default EarningsWrapper;
