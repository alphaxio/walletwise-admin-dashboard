"use client";

import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import ErrorBoundary from "@/components/ErrorBoundary";
import ErrorFallback from "@/components/ErrorFallback";
import PageTitle from "@/components/atoms/PageTitle/PageTitle";
import UserInfoLoader from "@/components/atoms/skeleton/UserInfoLoader";
import RestrictionEmptyState from "@/components/atoms/RestrictionEmptyState/RestrictionEmptyState";
import AppBreadcrumb from "@/components/molecules/AppBreadcrumb/AppBreadcrumb";
import DynamicTabs from "@/components/molecules/DynamicTabs/DynamicTabs";
import { StatementOfAccount } from "@/components/molecules/StatementOfAccount/StatementOfAccount";
import { canViewTransactions } from "@/lib/helpers/canViewTransactions";
import { userBreadcrumb } from "../../constants";
import { useGetUserInfo } from "../../hooks/useGetUserInfo";
import UserProfileCard from "../UserProfileCard/UserProfileCard";
import WalletSection from "../WalletSection/WalletSection";
import SessionsSection from "../SessionsSection/SessionsSection";
import UserLogsSection from "../UserLogsSection/UserLogsSection";
import SecuritySection from "../SecuritySection/SecuritySection";
import UserTransactionTable from "../UserTransactionTable/UserTransactionTable";
import UserReferralSection from "../UserReferralSection/UserReferralSection";
import UserDisputeSection from "../UserDisputeSection/UserDisputeSection";
import UserCardTransactions from "../UserCardTransactions/UserCardTransactions";
import UserActivity from "../UserActivity/UserActivity";

export default function UserInfoWrapper({ userId }: { userId: string }) {
  const { user } = useSelector((state: RootState) => state.auth);
  const {
    data, isLoading, isError, retryUserInfo, resetTabPage,
    currentPage, limit, setLimit, nextPage, prevPage,
    goToFirstPage, goToLastPage, isFirstPage, isLastPage, setCurrentPage,
  } = useGetUserInfo(userId);
  const currentAdminId = user?.id || "";
  const canViewFinancialDetails = canViewTransactions(userId, currentAdminId);
  const pagination = { currentPage, limit, setLimit, nextPage, prevPage, goToFirstPage, goToLastPage, isFirstPage, isLastPage, setCurrentPage };

  return <div className="min-w-0 space-y-6">
    <PageTitle title="User Details" description="Profile, account activity, and support in one place" />
    <AppBreadcrumb items={userBreadcrumb} />
    {isError && <ErrorFallback reset={retryUserInfo} message="Unable to load user details. Please try again." />}
    {isLoading ? <UserInfoLoader /> : !isError && <>
      <ErrorBoundary resetKey={data}>
        <UserProfileCard user={data?.user} kycId={data?.kyc?.kyc_id} isFlagged={data?.user?.user_flagged} flagReason={data?.user_status?.reason} />
      </ErrorBoundary>
    </>}
    <DynamicTabs defaultTab="overview" urlKey="userTab" onClick={resetTabPage} tabs={[
      {
        value: "overview", label: "Wallet", content: canViewFinancialDetails ? <section className="min-w-0 space-y-4" aria-label="Wallet overview">
          <h2 className="text-lg font-semibold">Wallet overview</h2>
          <WalletSection isLoading={isLoading} wallet={data?.wallet} commissionBalance={data?.commissionBalance} referralCount={data?.referrals?.referralCount || 0} userId={userId} currentAdminId={currentAdminId} />
        </section> : <RestrictionEmptyState />,
      },
      { value: "activity", label: "Activity", content: canViewFinancialDetails ? <UserActivity key={userId} userId={userId} /> : <RestrictionEmptyState /> },
      {
        value: "transactions", label: "Transactions", content: canViewFinancialDetails ? <section className="min-w-0 space-y-5" aria-label="User transactions">
          <ErrorBoundary resetKey={data}><StatementOfAccount userId={userId} /></ErrorBoundary>
          <UserTransactionTable {...pagination} isLoading={isLoading} data={data?.transactions?.transactions} totalPages={data?.transactions?.totalPages} />
        </section> : <RestrictionEmptyState />,
      },
      {
        value: "cards", label: "Cards", content: canViewFinancialDetails ? <section className="min-w-0" aria-label="Card transactions">
          <UserCardTransactions {...pagination} totalPages={1} isLoading={isLoading} cardTransactions={data?.cards?.transactions} />
        </section> : <RestrictionEmptyState />,
      },
      {
        value: "referrals", label: "Referrals", content: <section className="min-w-0" aria-label="User referrals">
          <UserReferralSection {...pagination} totalPages={1} isLoading={isLoading} userReferrals={data?.referrals?.referrals} />
        </section>,
      },
      {
        value: "disputes", label: "Disputes", content: <section className="min-w-0" aria-label="User disputes">
          <UserDisputeSection {...pagination} userDisputes={data?.disputes?.disputes} totalPages={data?.disputes?.totalPages} isLoading={isLoading} />
        </section>,
      },
      {
        value: "sessions", label: "Sessions & logs", content: isLoading ? <UserInfoLoader /> : <section className="min-w-0 space-y-5" aria-label="Sessions and audit logs">
          <ErrorBoundary resetKey={data}><SessionsSection sessions={data?.sessions?.sessions} /></ErrorBoundary>
          <ErrorBoundary resetKey={data}><UserLogsSection userLogs={data?.userLogs?.logs} /></ErrorBoundary>
        </section>,
      },
      { value: "security", label: "Security", content: isLoading ? <UserInfoLoader /> : <SecuritySection securityQuestions={data?.securityQuestions} /> },
    ]} />
  </div>;
}
