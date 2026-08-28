"use client";

import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { CurveType } from "recharts/types/shape/Curve";

interface AreaConfig {
  dataKey: string;
  label: string;
  color: string;
  fillOpacity?: number;
}

interface ReusableAreaChartProps {
  data: Array<Record<string, unknown>>;
  areas: AreaConfig[];
  xAxisKey: string;
  title?: string;
  description?: string;
  footerText?: string;
  trendingPercentage?: number;
  showTrending?: boolean;
  height?: number;
  currency?: string;
  showCurrency?: boolean;
  areaType?: CurveType | undefined;
  stacked?: boolean;
  showYAxis?: boolean;
}

const ReusableAreaChart = ({
  data,
  areas,
  xAxisKey,
  title = "Area Chart",
  description,
  footerText,
  trendingPercentage,
  showTrending = false,
  currency = "$",
  showCurrency = false,
  areaType = "natural",
  stacked = false,
  showYAxis = true,
}: ReusableAreaChartProps) => {
  const allValues = data.flatMap((item) =>
    areas.map((area) => Number(item[area.dataKey]) || 0),
  );
  const maxValue = Math.max(...allValues);
  const minValue = Math.min(...allValues);

  const paddedMaxValue = maxValue > 0 ? maxValue * 1.1 : maxValue * 0.9;
  const paddedMinValue = minValue < 0 ? minValue * 1.1 : 0;

  const formatValue = (value: number) => {
    const formatted = Math.abs(value).toLocaleString();
    const sign = value < 0 ? "-" : "";
    return showCurrency
      ? `${sign}${currency}${formatted}`
      : `${sign}${formatted}`;
  };

  const chartConfig = areas.reduce((config, area) => {
    config[area.dataKey] = {
      label: area.label,
      color: area.color,
    };
    return config;
  }, {} as ChartConfig);

  return (
    <Card className="dark:bg-gray-800">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={data}
            margin={{
              left: showYAxis ? 12 : 0,
              right: 0,
              top: 20,
            }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey={xAxisKey}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => {
                if (typeof value === "string" && value.length > 3) {
                  return value.slice(0, 3);
                }
                return value;
              }}
            />
            {showYAxis && (
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={formatValue}
                width={showCurrency ? 80 : 60}
                domain={[paddedMinValue, paddedMaxValue]}
              />
            )}
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="line"
                  formatter={(value) => formatValue(Number(value) * 19)}
                />
              }
            />
            {areas.map((area) => (
              <Area
                key={area.dataKey}
                dataKey={area.dataKey}
                type={areaType}
                fill={area.color}
                fillOpacity={area.fillOpacity || 0.4}
                stroke={area.color}
                stackId={stacked ? "stack" : undefined}
              />
            ))}
          </AreaChart>
        </ChartContainer>
      </CardContent>
      {(showTrending || footerText) && (
        <CardFooter>
          <div className="flex w-full items-start gap-2 text-sm">
            <div className="grid gap-2">
              {showTrending && trendingPercentage !== undefined && (
                <div className="flex items-center gap-2 leading-none font-medium">
                  Trending {trendingPercentage >= 0 ? "up" : "down"} by{" "}
                  {Math.abs(trendingPercentage)}% this month
                  <TrendingUp className="h-4 w-4" />
                </div>
              )}
              {footerText && (
                <div className="text-muted-foreground flex items-center gap-2 leading-none">
                  {footerText}
                </div>
              )}
            </div>
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default ReusableAreaChart;
