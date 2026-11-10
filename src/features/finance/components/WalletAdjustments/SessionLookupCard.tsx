"use client";

import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useSessionLookup } from "../../hooks/useWalletAdjustments";
import { formatNaira, SESSION_ID_PATTERN } from "../../helpers/walletAdjustments";

const Row = ({ label, value }: { label: string; value?: string | number | null }) => (
  <div className="flex justify-between gap-4 py-1 text-sm">
    <span className="text-muted-foreground">{label}</span>
    <span className="text-right font-medium break-all">{value ?? "—"}</span>
  </div>
);

export default function SessionLookupCard({ onUseReference }: { onUseReference: (sessionId: string, amount?: number) => void }) {
  const [sessionId, setSessionId] = useState("");
  const { mutate, data, isPending, reset } = useSessionLookup();

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (SESSION_ID_PATTERN.test(sessionId.trim())) mutate(sessionId.trim());
  };

  const sh = data?.safeHaven;
  const recorded = (data?.ourRecords.length ?? 0) > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Check a session ID</CardTitle>
        <CardDescription>
          See what SafeHaven reports for a transfer or deposit, and whether our database already has it.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={submit} className="flex gap-2">
          <Input
            value={sessionId}
            onChange={(e) => {
              setSessionId(e.target.value);
              reset();
            }}
            placeholder="e.g. 100002260916150610001587503142"
            className="font-mono"
          />
          <Button type="submit" disabled={isPending || !SESSION_ID_PATTERN.test(sessionId.trim())}>
            {isPending ? "Checking…" : "Check"}
          </Button>
        </form>

        {data && (
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border p-4">
              <h4 className="mb-2 font-semibold">SafeHaven</h4>
              {sh?.found ? (
                <>
                  <Row label="Result" value={`${sh.responseCode ?? "—"} ${sh.responseMessage ?? ""}`} />
                  <Row label="Direction" value={sh.type} />
                  <Row label="Amount" value={formatNaira(sh.amount)} />
                  <Row label="Reversed" value={sh.isReversed ? "Yes" : "No"} />
                  <Row label="To" value={`${sh.creditAccountName ?? ""} ${sh.creditAccountNumber ?? ""}`} />
                  <Row label="From" value={sh.debitAccountName} />
                  <Row label="Time" value={sh.createdAt} />
                </>
              ) : (
                <p className="text-sm text-muted-foreground">{sh?.message || "Not found on SafeHaven"}</p>
              )}
            </div>
            <div className="rounded-lg border p-4">
              <h4 className="mb-2 font-semibold">Our database</h4>
              {recorded ? (
                data.ourRecords.map((r) => (
                  <div key={r.id} className="border-b py-1 last:border-0">
                    <Row label="User" value={r.user_email} />
                    <Row label="Recorded" value={`${r.product_name ?? r.type} · ${r.status} · ${formatNaira(r.amount)}`} />
                    <Row label="Date" value={r.date} />
                  </div>
                ))
              ) : (
                <>
                  <p className="text-sm">
                    <strong>Not recorded.</strong> No transaction has this session ID, so nobody was credited or debited for it.
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-3"
                    onClick={() => onUseReference(data.sessionId, sh?.found ? sh.amount : undefined)}
                  >
                    Use in adjustment
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
