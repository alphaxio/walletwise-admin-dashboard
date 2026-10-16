import { Card } from "@/components/ui/card";
import { numberWithCommas } from "@/lib/helpers";
import { TrendingDown, TrendingUp } from "lucide-react";

interface StatisticCardProps {
  icon: React.ReactElement;
  color: "green" | "yellow" | "red" | "blue" | "orange" | "purple";
  title: string;
  value: number | null;
  currency?: string;
  onClick?: () => void;
  percentage?: number;
  percentageType?: "positive" | "negative";
  period?: string;
  secondValue?: number;
  secondCurrency?: string;
}

const StatisticCard = ({
  title,
  value,
  currency,
  onClick,
  color = "green",
  icon: Icon,
  percentage,
  percentageType,
  period,
  secondCurrency,
  secondValue,
}: StatisticCardProps) => {
  const colorClasses = {
    green: "bg-green-50 text-green-600 border-green-100",
    yellow: "bg-yellow-50 text-yellow-600 border-yellow-100",
    red: "bg-red-50 text-red-600 border-red-100",
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    orange: "bg-orange-50 text-orange-600 border-orange-100",
    purple:
      "text-purple-500 dark:text-purple-400 border-purple-100 bg-purple-50",
  };

  return (
    <Card
      className={`dark:bg-gray-800 p-6 h-fit ${
        onClick !== undefined
          ? "hover:shadow-lg transition-all duration-300 cursor-pointer"
          : ""
      }`}
      onClick={onClick}
    >
      <div className="flex justify-between">
        <h4 className="text-sm font-medium text-gray-600 dark:text-gray-300 capitalize mb-1">
          {title}
        </h4>
        {Icon !== undefined && (
          <div className={`p-3 rounded-xl border ${colorClasses[color]}`}>
            {Icon}
          </div>
        )}
      </div>
      <div className="space-y-2">
        <h1 className="text-2xl font-bold dark:text-gray-200">
          {currency && currency}
          {value == null || !Number.isFinite(Number(value)) ? "—" : numberWithCommas(value)}
        </h1>
        <h6 className="text-sm font-bold text-gray-600 dark:text-gray-300">
          {secondCurrency && secondCurrency}
          {secondValue && numberWithCommas(secondValue)}
        </h6>
      </div>

      {percentage !== undefined && (
        <div className="flex items-center gap-2">
          <span
            className={`text-xs px-3 py-1 rounded-full flex items-center gap-1 ${
              percentageType === "positive"
                ? "text-green-500 bg-green-50"
                : "text-red-500 bg-red-50"
            }`}
          >
            {percentageType === "positive" ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            {percentage}%
          </span>
          {period && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {period}
            </span>
          )}
        </div>
      )}
    </Card>
  );
};

export default StatisticCard;
