"use client";

import { motion } from "framer-motion";
import { DollarSign, PoundSterling, Ticket, User2 } from "lucide-react";

import { useGetGeneralStat } from "@/lib/hooks/useGetGeneralStat";

import SummaryCardLoader from "@/components/atoms/skeleton/SummaryCardLoader";
import StatisticCard from "../StatisticCard/StatisticCard";
import { PermissionGate } from "@/components/PermissionGate";

const OverviewSummary = () => {
  const { data, isLoading } = useGetGeneralStat();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className="grid grid-cols-1 sm:grid-cols-2 gap-6"
    >
      {isLoading ? (
        <SummaryCardLoader />
      ) : (
        <>
          {" "}
          <PermissionGate
            permissions={[
              "admin_management.read",
              "admin_management.write",
              "admin_management.create",
            ]}
            requireAll={false}
          >
            <StatisticCard
              title="Total revenue"
              value={data?.totalRevenue}
              icon={<DollarSign />}
              color="blue"
              currency="₦"
            />
            <StatisticCard
              title="Total profit"
              value={data?.totalProfit * 19}
              icon={<PoundSterling />}
              color="green"
              currency="₦"
            />
          </PermissionGate>
          <StatisticCard
            title="Total Disputes"
            value={data?.totalDisputes}
            icon={<Ticket />}
            color="purple"
          />
          <StatisticCard
            title="Total users"
            value={data?.totalUsers}
            icon={<User2 />}
            color="orange"
          />
        </>
      )}
    </motion.div>
  );
};

export default OverviewSummary;
