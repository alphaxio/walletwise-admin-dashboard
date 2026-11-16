"use client";

import { use } from "react";

import DashboardLayout from "@/components/templates/DashboardLayout/DashboardLayout";
import ServiceInfoWrapper from "@/features/services/components/ServiceInfoWrapper/ServiceInfoWrapper";

/**
 * Transaction info for categories without a page of their own (e.g. flex-save,
 * lock-save, goal-save, deposit, withdrawal). Categories with their own folder under
 * /services take priority over this route.
 */
const TransactionInfoFallbackPage = ({
  params,
}: {
  params: Promise<{ category: string; id: string }>;
}) => {
  const { id } = use(params);

  return (
    <DashboardLayout title="Service Info">
      <ServiceInfoWrapper
        serviceId={id}
        parentBreadcrumb={{ label: "All Transactions", href: "/all-transactions" }}
      />
    </DashboardLayout>
  );
};

export default TransactionInfoFallbackPage;
