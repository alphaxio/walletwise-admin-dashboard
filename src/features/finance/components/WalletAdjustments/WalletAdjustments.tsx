"use client";

import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useWalletOverview } from "../../hooks/useWalletAdjustments";
import AdjustmentForm, { type AdjustmentPrefill } from "./AdjustmentForm";
import AdjustmentHistory from "./AdjustmentHistory";
import SessionLookupCard from "./SessionLookupCard";
import WalletOverviewCard from "./WalletOverviewCard";

const errorMessage = (error: unknown) =>
  (error as { response?: { data?: { message?: string } } })?.response?.data?.message || "Could not load this user";

export default function WalletAdjustments() {
  const [search, setSearch] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [prefill, setPrefill] = useState<AdjustmentPrefill | null>(null);

  const overview = useWalletOverview(identifier);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setPrefill(null);
    setIdentifier(search.trim());
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Find a user</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="flex gap-2">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Email, user tag or phone number"
            />
            <Button type="submit" disabled={!search.trim() || overview.isFetching}>
              {overview.isFetching ? "Loading…" : "Search"}
            </Button>
          </form>
          {overview.isError && <p className="mt-3 text-sm text-red-600">{errorMessage(overview.error)}</p>}
        </CardContent>
      </Card>

      <SessionLookupCard onUseReference={(reference, amount) => setPrefill({ reference, amount })} />

      {overview.data && (
        <>
          <WalletOverviewCard overview={overview.data} />
          <AdjustmentForm
            // Remount when the user or the prefilled session changes so the form starts clean.
            key={`${overview.data.user.email}:${prefill?.reference ?? ""}`}
            overview={overview.data}
            prefill={prefill}
          />
          <AdjustmentHistory userEmail={overview.data.user.email} />
        </>
      )}

      {!overview.data && <AdjustmentHistory />}
    </div>
  );
}
