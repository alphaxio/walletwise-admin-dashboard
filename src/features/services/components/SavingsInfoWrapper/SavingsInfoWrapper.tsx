"use client";

import { useGetSavingsInfo } from "../../hooks/useGetSavingsInfo";
import PageTitle from "@/components/atoms/PageTitle/PageTitle";
import AppBreadcrumb from "@/components/molecules/AppBreadcrumb/AppBreadcrumb";
import AdminInfoLoader from "@/components/atoms/skeleton/AdminInfoLoader";
import ErrorFallback from "@/components/ErrorFallback";
import SavingsDetails from "./SavingsDetails";

const SavingsInfoWrapper = ({ savingsId }: { savingsId: string }) => {
  const { data, isLoading, isError, refetch } = useGetSavingsInfo(savingsId);

  return (
    <div className="space-y-6">
      <PageTitle title="Savings Transaction Details" description={`ID: #${savingsId}`} />
      <AppBreadcrumb items={[
        { label: "Savings Management", href: "/services/savings" },
        { label: "Transaction Info" },
      ]} />
      {isLoading ? <AdminInfoLoader /> : isError ? (
        <ErrorFallback reset={() => { void refetch(); }} message="Unable to load savings transaction details. Please try again." />
      ) : data ? (
        <SavingsDetails data={data} />
      ) : (
        <p role="status" className="rounded-lg border p-6 text-muted-foreground">No savings transaction details were found.</p>
      )}
    </div>
  );
};

export default SavingsInfoWrapper;
