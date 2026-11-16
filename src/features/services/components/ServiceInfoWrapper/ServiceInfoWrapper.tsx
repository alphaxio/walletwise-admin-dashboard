"use client";

import { useGetServiceInfo } from "../../hooks/useGetServiceInfo";

import PageTitle from "@/components/atoms/PageTitle/PageTitle";
import AppBreadcrumb from "@/components/molecules/AppBreadcrumb/AppBreadcrumb";
import TypeBadge from "@/components/atoms/TypeBadge/TypeBadge";
import TransactionSummaryCard from "../TransactionSummaryCard/TransactionSummaryCard";
import TransactionDetailsCard from "../TransactionDetailsCard/TransactionDetailsCard";
import ServiceDetailsCard from "@/components/molecules/ServiceDetailsCard/ServiceDetailsCard";
import UserInformation from "../UserInformation/UserInformation";
import AdminInfoLoader from "@/components/atoms/skeleton/AdminInfoLoader";

const ServiceInfoWrapper = ({
  serviceId,
  parentBreadcrumb,
}: {
  serviceId: string;
  /** Where the breadcrumb goes back to; defaults to the category's management page. */
  parentBreadcrumb?: { label: string; href: string };
}) => {
  const { isLoading, data } = useGetServiceInfo(serviceId);

  const category = data?.category || "";

  const userBreadcrumb = [
    parentBreadcrumb ?? { label: `${category} Management`, href: `/services/${category}` },
    { label: "Transaction Info" },
  ];

  return (
    <div className="space-y-4">
      {isLoading ? (
        <AdminInfoLoader />
      ) : (
        <>
          <PageTitle
            title="Transaction Details"
            description={`ID: #${data?.id}`}
          />
          <AppBreadcrumb items={userBreadcrumb} />
          <TypeBadge type={data?.type || ""} />
          <div className="lg:col-span-1">
            <TransactionSummaryCard data={data} />
          </div>
          <div className="w-full grid lg:grid-cols-2 grid-cols-1 gap-6">
            <TransactionDetailsCard data={data} />
            <ServiceDetailsCard
              details={data?.details}
              category={data?.category}
              type={data?.type || ""}
            />
          </div>
          <div className="grid grid-cols-1">
            <UserInformation data={data} />
          </div>
        </>
      )}
    </div>
  );
};

export default ServiceInfoWrapper;
