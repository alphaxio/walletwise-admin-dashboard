"use client";

import ErrorBoundary from "@/components/ErrorBoundary";
import ErrorFallback from "@/components/ErrorFallback";

import PageTitle from "@/components/atoms/PageTitle/PageTitle";
import AppBreadcrumb from "@/components/molecules/AppBreadcrumb/AppBreadcrumb";
import UserProfileCard from "../UserProfileCard/UserProfileCard";
import WalletSection from "../WalletSection/WalletSection";
import UserInfoLoader from "@/components/atoms/skeleton/UserInfoLoader";
import SessionsSection from "../SessionsSection/SessionsSection";
import UserLogsSection from "../UserLogsSection/UserLogsSection";
import SecuritySection from "../SecuritySection/SecuritySection";
import UserTransactionTable from "../UserTransactionTable/UserTransactionTable";

import { userBreadcrumb } from "../../constants";
import { useGetUserInfo } from "../../hooks/useGetUserInfo";
import UserReferralSection from "../UserReferralSection/UserReferralSection";
import { canViewTransactions } from "@/lib/helpers/canViewTransactions";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import RestrictionEmptyState from "@/components/atoms/RestrictionEmptyState/RestrictionEmptyState";
import UserDisputeSection from "../UserDisputeSection/UserDisputeSection";
import { StatementOfAccount } from "@/components/molecules/StatementOfAccount/StatementOfAccount";
import UserCardTransactions from "../UserCardTransactions/UserCardTransactions";
import FlagUserAlert from "@/components/molecules/FlagUserAlert/FlagUserAlert";

const UserInfoWrapper = ({ userId }: { userId: string }) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const {
    data,
    isLoading,
    isError,
    refetch,
    currentPage,
    limit,
    setLimit,
    nextPage,
    prevPage,
    goToFirstPage,
    goToLastPage,
    isFirstPage,
    isLastPage,
    setCurrentPage,
  } = useGetUserInfo(userId);

  const currentAdminId = user?.id || "";

  return (
    <div className="space-y-4">
      {isError && <ErrorFallback reset={() => { void refetch(); }} message="Unable to load user details. Please try again." />}
      <PageTitle
        title="User Details"
        description="Comprehensive user information and activity"
      />
      <AppBreadcrumb items={userBreadcrumb} />
      {isLoading ? (
        <UserInfoLoader />
      ) : (
        <>
          <FlagUserAlert
            userId={userId}
            email={data?.user?.email}
            isSuspicious={data?.user?.user_flagged}
            flagReason={data?.user_status?.reason}
          />
          <ErrorBoundary resetKey={data}>
            <UserProfileCard user={data?.user} kycId={data?.kyc?.kyc_id} />
          </ErrorBoundary>
        </>
      )}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Wallet Overview
        </h2>
        <ErrorBoundary resetKey={data}>
          <WalletSection
            isLoading={isLoading}
            wallet={data?.wallet}
            commissionBalance={data?.commissionBalance}
            referralCount={data?.referrals?.referralCount || 0}
            userId={userId}
            currentAdminId={currentAdminId}
          />
        </ErrorBoundary>
      </div>

      {canViewTransactions(userId, currentAdminId) ? (
        <>
          <ErrorBoundary resetKey={data}>
            <StatementOfAccount userId={userId} />
          </ErrorBoundary>
          <ErrorBoundary resetKey={data}>
            <UserTransactionTable
              isLoading={isLoading}
              data={data?.transactions?.transactions}
              totalPages={data?.transactions?.totalPages}
              currentPage={currentPage}
              prevPage={prevPage}
              nextPage={nextPage}
              goToFirstPage={goToFirstPage}
              goToLastPage={goToLastPage}
              isFirstPage={isFirstPage}
              isLastPage={isLastPage}
              limit={limit}
              setCurrentPage={setCurrentPage}
              setLimit={setLimit}
            />
          </ErrorBoundary>
        </>
      ) : (
        <RestrictionEmptyState />
      )}
      <ErrorBoundary resetKey={data}>
        <UserCardTransactions
          totalPages={1}
          currentPage={currentPage}
          prevPage={prevPage}
          nextPage={nextPage}
          goToFirstPage={goToFirstPage}
          goToLastPage={goToLastPage}
          isFirstPage={isFirstPage}
          isLastPage={isLastPage}
          limit={limit}
          setLimit={setLimit}
          isLoading={isLoading}
          cardTransactions={data?.cards?.transactions}
          setCurrentPage={setCurrentPage}
        />
      </ErrorBoundary>
      <ErrorBoundary resetKey={data}>
        <UserReferralSection
          totalPages={1}
          currentPage={currentPage}
          prevPage={prevPage}
          nextPage={nextPage}
          goToFirstPage={goToFirstPage}
          goToLastPage={goToLastPage}
          isFirstPage={isFirstPage}
          isLastPage={isLastPage}
          limit={limit}
          setLimit={setLimit}
          isLoading={isLoading}
          userReferrals={data?.referrals?.referrals}
          setCurrentPage={setCurrentPage}
        />
      </ErrorBoundary>
      <ErrorBoundary resetKey={data}>
        <UserDisputeSection
          userDisputes={data?.disputes?.disputes}
          totalPages={data?.disputes?.totalPages}
          currentPage={currentPage}
          prevPage={prevPage}
          nextPage={nextPage}
          goToFirstPage={goToFirstPage}
          goToLastPage={goToLastPage}
          isFirstPage={isFirstPage}
          isLastPage={isLastPage}
          limit={limit}
          setLimit={setLimit}
          isLoading={isLoading}
          setCurrentPage={setCurrentPage}
        />
      </ErrorBoundary>
      {isLoading ? (
        <>
          <UserInfoLoader />
          <UserInfoLoader />
        </>
      ) : (
        <>
          <ErrorBoundary resetKey={data}>
            <SessionsSection sessions={data?.sessions?.sessions} />
          </ErrorBoundary>
          <ErrorBoundary resetKey={data}>
            <UserLogsSection userLogs={data?.userLogs?.logs} />
          </ErrorBoundary>
          <ErrorBoundary resetKey={data}>
            <SecuritySection securityQuestions={data?.securityQuestions} />
          </ErrorBoundary>
        </>
      )}
    </div>
  );
};

export default UserInfoWrapper;
