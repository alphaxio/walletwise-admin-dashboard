"use client";


import { User } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";

import { Column } from "./Column";
import { UserReferralType } from "../../types";

import SectionHeader from "@/components/atoms/SectionHeader/SectionHeader";
import TableWrapper from "@/components/organisms/TableWrapper/TableWrapper";
import TableLoader from "@/components/atoms/skeleton/TableLoader";

const UserReferralSection = ({
  userReferrals,
  totalPages,
  currentPage,
  prevPage,
  nextPage,
  goToFirstPage,
  goToLastPage,
  isFirstPage,
  isLastPage,
  limit,
  setLimit,
  isLoading,
  setCurrentPage,
}: {
  userReferrals: UserReferralType[];
  totalPages: number;
  currentPage: number;
  prevPage: () => void;
  nextPage: (totalPages: number) => void;
  goToLastPage: (totalPages: number) => void;
  goToFirstPage: () => void;
  isFirstPage: () => boolean;
  isLastPage: (totalPages: number) => boolean;
  limit: number;
  setLimit: (limit: number) => void;
  isLoading: boolean;
  setCurrentPage: (page: number) => void;
}) => {

  const typedColumns = Column as ColumnDef<unknown>[];

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden">
      <SectionHeader
        icon={User}
        title="User referrals"
        subtitle={`${userReferrals?.length} referral${
          userReferrals?.length !== 1 ? "s" : ""
        }`}
      />
      {(
        <div>
          {isLoading ? (
            <TableLoader />
          ) : (
            <TableWrapper
              columns={typedColumns}
              data={userReferrals || []}
              totalPages={totalPages}
              currentPage={currentPage}
              prevPage={prevPage}
              nextPage={nextPage}
              goToFirstPage={goToFirstPage}
              goToLastPage={goToLastPage}
              isFirstPage={isFirstPage}
              isLastPage={isLastPage}
              limit={limit}
              setLimit={setLimit}
              setCurrentPage={setCurrentPage}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default UserReferralSection;
