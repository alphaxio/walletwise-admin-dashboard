"use client";


import { User } from "lucide-react";

import SectionHeader from "@/components/atoms/SectionHeader/SectionHeader";
import TableLoader from "@/components/atoms/skeleton/TableLoader";
import TableWrapper from "@/components/organisms/TableWrapper/TableWrapper";

import { UserDisputeType } from "../../types";
import { Column } from "./Column";
import { ColumnDef } from "@tanstack/react-table";

const UserDisputeSection = ({
  userDisputes,
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
  userDisputes: UserDisputeType[];
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
        title="User disputes"
        subtitle={`${userDisputes?.length} dispute${
          userDisputes?.length !== 1 ? "s" : ""
        }`}
      />
      {(
        <div>
          {isLoading ? (
            <TableLoader />
          ) : (
            <TableWrapper
              columns={typedColumns}
              data={userDisputes || []}
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

export default UserDisputeSection;
