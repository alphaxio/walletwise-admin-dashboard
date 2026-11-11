"use client";

import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useSweepHistory } from "../../hooks/useSettlementSweep";
import { formatNaira } from "../../helpers/walletAdjustments";

const PAGE_SIZE = 20;
const VARIANT = { success: "default", pending: "outline", failed: "destructive", unknown: "destructive" } as const;

export default function SweepHistory() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useSweepHistory(page, PAGE_SIZE);
  const pages = data ? Math.max(Math.ceil(data.total / PAGE_SIZE), 1) : 1;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sweep history</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">
          &ldquo;unknown&rdquo; means SafeHaven did not confirm. Check that account&apos;s balance before sweeping it again.
        </p>
        <div className="overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>When</TableHead>
                <TableHead>By</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Account</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Session ID</TableHead>
                <TableHead>Message</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground">Loading…</TableCell>
                </TableRow>
              )}
              {data?.items.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground">No sweeps yet</TableCell>
                </TableRow>
              )}
              {data?.items.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="whitespace-nowrap">{new Date(s.created_at).toLocaleString("en-NG")}</TableCell>
                  <TableCell>{s.admin_email}</TableCell>
                  <TableCell>{s.user_email}</TableCell>
                  <TableCell className="font-mono text-xs">{s.account_number}</TableCell>
                  <TableCell className="text-right">{formatNaira(s.amount)}</TableCell>
                  <TableCell><Badge variant={VARIANT[s.status]}>{s.status}</Badge></TableCell>
                  <TableCell className="font-mono text-xs">{s.session_id ?? "—"}</TableCell>
                  <TableCell className="max-w-[260px] truncate" title={s.message ?? ""}>{s.message ?? "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {pages > 1 && (
          <div className="flex items-center justify-end gap-2 text-sm">
            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</Button>
            <span>Page {page} of {pages}</span>
            <Button variant="outline" size="sm" disabled={page >= pages} onClick={() => setPage((p) => p + 1)}>Next</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
