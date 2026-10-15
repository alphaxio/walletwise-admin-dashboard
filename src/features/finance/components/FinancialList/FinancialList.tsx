"use client";

import { useState } from "react";
import { useFinancialList } from "../../hooks/useFinancialData";
import { columns } from "../../constants/lists";
import { recordId } from "../../helpers/records";
import type { FinancialRecord, Resource } from "../../types/index";
import FinancialSummary from "../FinancialSummary/FinancialSummary";
import FinancialFilters from "../FinancialFilters/FinancialFilters";
import FinancialTable from "../FinancialTable/FinancialTable";
import FinancialPagination from "../FinancialPagination/FinancialPagination";
import AccrualExportActions from "../AccrualExportActions/AccrualExportActions";
import FinancialDetail from "../FinancialDetail/FinancialDetail";
import RequestState from "../RequestState/RequestState";

export default function FinancialList({
  resource,
  userId = "",
}: {
  resource: Resource;
  userId?: string;
}) {
  const query = useFinancialList(resource, userId);
  const [selected, setSelected] = useState<FinancialRecord | null>(null);
  const fields = columns[resource];

  return (
    <div className="space-y-6">
      <FinancialSummary
        resource={resource}
        values={query.data?.metrics}
        status={query.filters.status}
        onStatusChange={(status) => query.update({ status })}
      />
      <FinancialFilters
        resource={resource}
        filters={query.filters}
        onChange={query.update}
        onRefresh={() => query.refetch()}
      />
      {userId && <p>Transactions for user: {userId}</p>}
      <RequestState
        pending={query.isPending}
        error={query.isError}
        retry={() => query.refetch()}
      />
      {!query.isPending && !query.isError && (
        <>
          <FinancialTable
            resource={resource}
            fields={fields}
            records={query.data?.records ?? []}
            onSelect={setSelected}
          />
          <FinancialPagination
            filters={query.filters}
            total={query.data?.total ?? 0}
            totalPages={query.data?.totalPages ?? 1}
            onChange={query.update}
          />
          {resource === "savings/accruals" && (
            <AccrualExportActions filters={query.filters} fields={fields} />
          )}
        </>
      )}
      {resource === 'savings/accruals' && <AccrualExportActions filters={query.filters} fields={fields} visible={!query.isPending && !query.isError} />}
    {selected && (
        <FinancialDetail
          resource={resource}
          id={recordId(
            selected,
            resource.startsWith("usd/") && resource !== "usd/transactions",
          )}
          record={selected}
          close={() => setSelected(null)}
        />
      )}
    </div>
  );
}
