import EarningsStats from "../EarningsStats/EarningsStats";

interface EarningsSummaryProps {
  isLoading: boolean;
  totalRevenue: number;
  totalProfit: number;
  totalInappRevenue: number;
}

const EarningsSummary = ({
  isLoading,
  totalRevenue,
  totalProfit,
  totalInappRevenue,
}: EarningsSummaryProps) => {
  return (
    <div>
      <EarningsStats
        isLoading={isLoading}
        totalRevenue={totalRevenue}
        totalProfit={totalProfit}
        totalInappRevenue={totalInappRevenue}
      />
    </div>
  );
};

export default EarningsSummary;
