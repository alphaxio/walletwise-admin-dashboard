"use client";

import { useUsdOverviewCard } from "../../hooks/useUsdOverviewCard";
import { DollarSign } from "lucide-react";
import StatisticCard from "@/components/molecules/StatisticCard/StatisticCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export default function UsdOverviewCard({
  metric = "revenue",
}: {
  metric?: "revenue" | "inflow";
}) {
  const query = useUsdOverviewCard(metric);
  if (query.isPending)
    return (
      <Skeleton className="h-40 rounded-xl" aria-label="Loading USD total" />
    );
  return (
    <div className="space-y-2">
      <StatisticCard
        title={metric === "inflow" ? "Total USD inflow" : "Total USD revenue"}
        value={query.value}
        currency="US$"
        icon={<DollarSign />}
        color="blue"
      />
      {query.isError && (
        <Button variant="outline" onClick={() => query.refetch()}>
          Retry USD total
        </Button>
      )}
    </div>
  );
}
