"use client";

import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAdjustmentHistory } from "../../hooks/useWalletAdjustments";
import { formatNaira } from "../../helpers/walletAdjustments";

const PAGE_SIZE = 20;

export default function AdjustmentHistory({ userEmail }: { userEmail?: string }) {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAdjustmentHistory(userEmail, page, PAGE_SIZE);
  const pages = data ? Math.max(Math.ceil(data.total / PAGE_SIZE), 1) : 1;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{userEmail ? "Adjustments for this user" : "All manual adjustments"}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>When</TableHead>
                <TableHead>By</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Kind</TableHead>
                <TableHead className="text-right">Change</TableHead>
                <TableHead className="text-right">Balance</TableHead>
                <TableHead>Reference</TableHead>
                <TableHead>Reason</TableHead>
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
                  <TableCell colSpan={8} className="text-center text-muted-foreground">No adjustments yet</TableCell>
                </TableRow>
              )}
              {data?.items.map((a) => (
                <TableRow key={a.id}>
                  <TableCell className="whitespace-nowrap">{new Date(a.created_at).toLocaleString("en-NG")}</TableCell>
                  <TableCell>{a.admin_email}</TableCell>
                  <TableCell>{a.user_email}</TableCell>
                  <TableCell><Badge variant="outline">{a.kind}</Badge></TableCell>
                  <TableCell className={`text-right ${Number(a.wallet_change) >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {Number(a.wallet_change) >= 0 ? "+" : "−"}
                    {formatNaira(Math.abs(Number(a.wallet_change)))}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-right">
                    {formatNaira(a.balance_before)} → {formatNaira(a.balance_after)}
                  </TableCell>
                  <TableCell className="max-w-[160px] truncate font-mono text-xs" title={a.reference}>{a.reference}</TableCell>
                  <TableCell className="max-w-[260px] truncate" title={a.reason}>{a.reason}</TableCell>
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
