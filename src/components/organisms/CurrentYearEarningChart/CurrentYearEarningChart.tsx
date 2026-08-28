"use client";

import ChartLoader from "@/components/atoms/skeleton/ChartLoader";
import ReusableAreaChart from "@/components/molecules/charts/ReusableAreaChart/ReusableAreaChart";

import { numberWithCommas } from "@/lib/helpers";
import { useGetYearlyEarnings } from "@/lib/hooks/useGetYearlyEarnings";

const CurrentYearEarningChart = ({
  selectedYear,
}: {
  selectedYear: string;
}) => {
  const { data, isLoading } = useGetYearlyEarnings(selectedYear);

  return (
    <>
      {isLoading ? (
        <ChartLoader />
      ) : (
        <ReusableAreaChart
          data={data?.monthlyEarnings || []}
          areas={[
            {
              dataKey: "totalProfit",
              label: "Profit",
              color: "#87ceeb80",
            },
          ]}
          xAxisKey="month"
          title={`Total Earnings ${selectedYear} ₦${numberWithCommas(
            data?.totalProfit * 19 || 0,
          )}`}
          description={`Showing breakdown of earnings in ${selectedYear}`}
          showYAxis={false}
        />
      )}
    </>
  );
};

export default CurrentYearEarningChart;
