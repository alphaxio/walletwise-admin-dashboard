import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { type ColumnDef, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Column as allTransactionColumns } from "./molecules/TransactionHistory/Column";
import { Column as userTransactionColumns } from "@/features/users/components/UserTransactionTable/Column";
import TableBodyWrap from "./molecules/TableBodyWrap/TableBodyWrap";
import { Table } from "./ui/table";

const nullableTransaction = {
  id: "transaction-test",
  transaction_id: "reference-test",
  date: null,
  type: null,
  category: null,
  asset_id: null,
  status: null,
  amount: null,
  balance: null,
  commission: null,
  user: null,
};

function TransactionRows({ columns, data }: { columns: ColumnDef<unknown>[]; data: unknown[] }) {
  const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel() });
  return <Table><TableBodyWrap table={table} columns={columns} /></Table>;
}

afterEach(() => { cleanup(); vi.restoreAllMocks(); });

for (const [name, columns] of [
  ["all transactions", allTransactionColumns],
  ["user transactions", userTransactionColumns(true)],
] as const) {
  describe(name, () => {
    it("renders null API fields without throwing or using an error fallback", () => {
      const errors = vi.spyOn(console, "error").mockImplementation(() => {});
      render(<TransactionRows columns={columns as ColumnDef<unknown>[]} data={[nullableTransaction]} />);
      expect(screen.getByText("reference-test")).toBeInTheDocument();
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
      expect(errors).not.toHaveBeenCalled();
    });

    it("survives replacing loaded results with nullable filtered results", () => {
      const errors = vi.spyOn(console, "error").mockImplementation(() => {});
      const view = render(<TransactionRows columns={columns as ColumnDef<unknown>[]} data={[
        { ...nullableTransaction, category: "airtime", type: "debit", status: "success", date: "2026-10-04T12:00:00Z" },
      ]} />);
      view.rerender(<TransactionRows columns={columns as ColumnDef<unknown>[]} data={[nullableTransaction]} />);
      expect(screen.getByText("reference-test")).toBeInTheDocument();
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
      expect(errors).not.toHaveBeenCalled();
    });
  });
}
