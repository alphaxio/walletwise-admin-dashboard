"use client";

import { useState } from "react";

import { TableWrapperProps } from "@/lib/types";

import { Table } from "@/components/ui/table";
import {
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  getSortedRowModel,
  getFilteredRowModel,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  RowSelectionState,
} from "@tanstack/react-table";

import TableHeaderWrap from "@/components/molecules/TableHeaderWrap/TableHeaderWrap";
import TableBodyWrap from "@/components/molecules/TableBodyWrap/TableBodyWrap";
import PaginationComponent from "@/components/molecules/PaginationComponent/PaginationComponent";
import TableResourceToolbar from "@/components/molecules/TableResourceToolbar/TableResourceToolbar";
import TableLoader from "@/components/atoms/skeleton/TableLoader";

const TableWrapper = ({
  columns,
  data,
  totalPages,
  currentPage,
  prevPage,
  nextPage,
  goToLastPage,
  goToFirstPage,
  isFirstPage,
  isLastPage,
  limit,
  setLimit,
  setSelectedDateFilterValue,
  refetch,
  handleSortChange,
  search,
  handleChange,
  handleClear,
  onSubmit,
  sortOptions,
  setCurrentPage,
  isLoading,
  showExport = true,
}: TableWrapperProps) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    enableRowSelection: true,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination: {
        pageIndex: 0,
        pageSize: limit || 10,
      },
    },
  });

  return (
    <div className="space-y-2 pt-6">
      <div className="flex justify-between items-center">
        <TableResourceToolbar
          setSelectedDateFilterValue={setSelectedDateFilterValue}
          search={search}
          handleChange={handleChange}
          handleClear={handleClear}
          onSubmit={onSubmit}
          refetch={refetch}
          handleSortChange={handleSortChange}
          table={table}
          sortOptions={sortOptions}
          rowSelection={rowSelection}
          showExport={showExport}
        />
      </div>
      {isLoading ? (
        <TableLoader />
      ) : (
        <>
          <div className="shadow">
            <Table className="dark:bg-gray-800 no-scrollbar">
              <TableHeaderWrap table={table} />
              <TableBodyWrap table={table} columns={columns} />
            </Table>
          </div>
          <PaginationComponent
            totalPages={totalPages}
            currentPage={currentPage}
            prevPage={prevPage}
            nextPage={nextPage}
            goToLastPage={goToLastPage}
            goToFirstPage={goToFirstPage}
            isFirstPage={isFirstPage}
            isLastPage={isLastPage}
            limit={limit}
            setLimit={setLimit}
            setCurrentPage={setCurrentPage}
          />
        </>
      )}
    </div>
  );
};

export default TableWrapper;
