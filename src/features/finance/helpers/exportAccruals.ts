import { fetchList } from "../api";
import { display, read } from "./records";
import type { Field, FinancialRecord, ListFilters } from "../types";
export async function exportAccruals(
  filters: ListFilters,
  fields: Field[],
  format: "csv" | "xlsx",
) {
  const records: FinancialRecord[] = [];
  let page = 1;
  let totalPages = 1;
  do {
    const result = await fetchList("savings/accruals", {
      ...filters,
      page,
      limit: 100,
    });
    records.push(...result.records);
    totalPages = result.totalPages;
    page++;
  } while (page <= totalPages);
  const XLSX = await import("xlsx");
  // Spreadsheet programs interpret these prefixes as formulas. Export them as text.
  const text = (value: unknown) => {
    const result = display(value);
    return /^[=+\-@\t\r]/.test(result) ? `'${result}` : result;
  };
  const rows = records.map((record) =>
    Object.fromEntries(
      fields.map((field) => [field.label, text(read(record, field.key))]),
    ),
  );
  const sheet = XLSX.utils.json_to_sheet(rows);
  const book = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(book, sheet, "Accruals");
  XLSX.writeFile(book, `savings-accruals.${format}`, { bookType: format });
}
