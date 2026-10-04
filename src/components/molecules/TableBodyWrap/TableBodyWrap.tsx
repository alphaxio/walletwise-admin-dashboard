import ErrorBoundary from "@/components/ErrorBoundary";
import { ColumnDef, Table, flexRender } from "@tanstack/react-table";

import { TableBody, TableCell, TableRow } from "@/components/ui/table";

interface TableBodyWrapProps<TData = unknown> {
  table: Table<TData>;
  columns: ColumnDef<TData>[];
}

const TableBodyWrap = ({ table, columns }: TableBodyWrapProps) => {
  if (!table) {
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={columns?.length} className="h-24 text-center">
            No results.
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }

  const rowModel = table?.getRowModel();

  return (
    <TableBody>
      {rowModel?.rows?.length < 1 ? (
        <TableRow>
          <TableCell colSpan={columns?.length} className="h-24 text-center">
            No results.
          </TableCell>
        </TableRow>
      ) : (
        rowModel?.rows.map((row) => (
          <TableRow
            key={row?.id}
            data-state={row.getIsSelected() && "selected"}
            className={row.getIsSelected() ? "bg-blue-50" : ""}
          >
            {row?.getVisibleCells().map((cell) => (
              <TableCell key={cell.id} className="max-w-lg whitespace-normal">
                <ErrorBoundary compact resetKey={row.original}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </ErrorBoundary>
              </TableCell>
            ))}
          </TableRow>
        ))
      )}
    </TableBody>
  );
};

export default TableBodyWrap;
