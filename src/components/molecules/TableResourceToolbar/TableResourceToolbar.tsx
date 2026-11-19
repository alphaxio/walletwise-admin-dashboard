import { FormEvent } from "react";

import { RowSelectionState, Table } from "@tanstack/react-table";

import { DateFilterValue, SortOption } from "@/lib/types";

import ColumnSorting from "../ColumnSorting/ColumnSorting";
import DateFilterComponent from "@/components/organisms/DateFilterComponent/DateFilterComponent";
import SearchInput from "../SearchInput/SearchInput";
import SortDropdown from "@/components/organisms/SortDropdown/SortDropdown";
import ExportButton from "../ExportButton/ExportButton";

interface TableResourceToolbarProps<TData = unknown> {
  setSelectedDateFilterValue?: (value: DateFilterValue) => void;
  search?: string | number;
  handleChange?: (search: string) => void;
  handleClear?: () => void;
  onSubmit?: (e: FormEvent) => void;
  refetch?: () => void;
  handleSortChange?: (values: { [key: number]: string }) => void;
  table: Table<TData>;
  sortOptions?: SortOption[];
  rowSelection: RowSelectionState;
  showExport?: boolean;
}

const TableResourceToolbar = ({
  setSelectedDateFilterValue,
  search,
  handleChange,
  handleClear,
  onSubmit,
  refetch,
  handleSortChange,
  table,
  sortOptions,
  rowSelection,
  showExport = true,
}: TableResourceToolbarProps) => {
  const showSearch =
    search !== undefined &&
    handleChange !== undefined &&
    handleClear !== undefined &&
    onSubmit !== undefined;

  const showSort =
    refetch !== undefined &&
    handleSortChange !== undefined &&
    sortOptions !== undefined;

  return (
    <div className="flex justify-between items-center w-full gap-6">
      <div className="flex items-center gap-2 max-md:hidden">
        {showSort && (
          <SortDropdown
            sortOptions={sortOptions}
            onSortChange={handleSortChange}
            onFilter={() => refetch()}
          />
        )}
        {setSelectedDateFilterValue !== undefined && (
          <DateFilterComponent
            onDateChange={(value) => {
              setSelectedDateFilterValue(value);
            }}
          />
        )}
      </div>
      <div className="flex items-center justify-end flex-1 gap-2">
        {showSearch && (
          <SearchInput
            value={search}
            handleChange={handleChange}
            handleClear={handleClear}
            onSubmit={onSubmit}
          />
        )}
        {showExport && <ExportButton table={table} rowSelection={rowSelection} />}
        <ColumnSorting table={table} />
      </div>
    </div>
  );
};

export default TableResourceToolbar;
