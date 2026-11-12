"use client";

import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useRunSweep, useSweepScan } from "../../hooks/useSettlementSweep";
import { defaultSelection, isSweepable, needsReview, summarizeScan } from "../../helpers/settlementSweep";
import { formatNaira, round2 } from "../../helpers/walletAdjustments";
import type { SweepAccountRow } from "../../types/settlementSweep";
import SweepHistory from "./SweepHistory";

type Filter = "extra" | "review" | "short" | "all";

const FILTERS: { value: Filter; label: string }[] = [
  { value: "extra", label: "SafeHaven higher" },
  { value: "review", label: "Needs review" },
  { value: "short", label: "App higher (short)" },
  { value: "all", label: "All" },
];

const matches = (row: SweepAccountRow, filter: Filter) => {
  if (filter === "all") return true;
  if (row.gap === null) return filter === "review";
  if (filter === "extra") return row.gap > 0;
  if (filter === "short") return row.gap < 0;
  return needsReview(row);
};

const Stat = ({ label, value, hint, tone }: { label: string; value: string; hint?: string; tone?: "good" | "bad" }) => (
  <div className="rounded-lg border p-4">
    <p className="text-xs uppercase text-muted-foreground">{label}</p>
    <p className={`mt-1 text-xl font-semibold ${tone === "good" ? "text-green-600" : tone === "bad" ? "text-red-600" : ""}`}>
      {value}
    </p>
    {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
  </div>
);

const RESULT_VARIANT = { success: "default", failed: "destructive", unknown: "destructive", skipped: "outline" } as const;

export default function SettlementSweep() {
  const scan = useSweepScan();
  const sweep = useRunSweep();
  const [filter, setFilter] = useState<Filter>("extra");
  const [minAmount, setMinAmount] = useState("1");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [reason, setReason] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [typed, setTyped] = useState("");

  const min = Math.max(Number(minAmount) || 0, 1);
  const totals = useMemo(() => summarizeScan(scan.rows), [scan.rows]);
  const visible = useMemo(() => scan.rows.filter((r) => matches(r, filter)), [scan.rows, filter]);
  const chosen = useMemo(
    () => scan.rows.filter((r) => selected.has(r.email) && isSweepable(r, min) && !sweep.results[r.email]),
    [scan.rows, selected, min, sweep.results]
  );
  const chosenTotal = round2(chosen.reduce((sum, r) => sum + (r.gap ?? 0), 0));
  // Sweeping is allowed only after every account has been read.
  const scanDone = !scan.scanning && scan.total !== null && scan.stoppedAt === null && scan.rows.length >= scan.total;

  const startScan = async () => {
    sweep.clear();
    setSelected(new Set());
    await scan.start();
  };

  const toggle = (email: string, on: boolean) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (on) next.add(email);
      else next.delete(email);
      return next;
    });

  const confirm = async () => {
    setConfirming(false);
    setTyped("");
    await sweep.run(
      chosen.map((r) => ({ email: r.email, amount: r.gap as number })),
      reason.trim()
    );
    setSelected(new Set());
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Scan personal accounts</CardTitle>
          <CardDescription>
            Reads the SafeHaven balance of every user with their own account and compares it with their app wallet.
            Nothing moves during a scan.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-3">
          {scan.scanning ? (
            <Button variant="outline" onClick={scan.stop}>Stop</Button>
          ) : (
            <>
              {scan.stoppedAt !== null && (
                <Button onClick={scan.resume} disabled={sweep.running}>Continue from {scan.stoppedAt}</Button>
              )}
              <Button variant={scan.stoppedAt !== null ? "outline" : "default"} onClick={startScan} disabled={sweep.running}>
                {scan.total === null ? "Scan all accounts" : "Scan again"}
              </Button>
            </>
          )}
          {scan.total !== null && (
            <span className="text-sm text-muted-foreground">
              {scan.scanning ? (scan.retrying ? "Retrying… " : "Scanning… ") : scan.stoppedAt !== null ? "Paused. " : ""}
              {scan.rows.length} of {scan.total} accounts read
            </span>
          )}
        </CardContent>
      </Card>

      {scan.rows.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Total in SafeHaven" value={formatNaira(totals.safeHaven)} hint={`${totals.checked} accounts read`} />
          <Stat label="Total app wallets" value={formatNaira(totals.app)} hint="Same accounts" />
          <Stat
            label="Extra in SafeHaven"
            value={formatNaira(totals.extra)}
            hint={`${totals.extraAccounts} accounts can be swept`}
            tone="good"
          />
          <Stat
            label="Users short"
            value={formatNaira(totals.short)}
            hint={`${totals.shortAccounts} accounts hold less than the app shows${totals.failed ? ` · ${totals.failed} unreadable` : ""}`}
            tone={totals.short > 0 ? "bad" : undefined}
          />
        </div>
      )}

      {scan.rows.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Accounts</CardTitle>
            <CardDescription>
              Extra = SafeHaven balance minus app balance. &ldquo;Needs review&rdquo; means the extra is more than the
              spending the app recorded, so part of it may be a deposit we never credited. Accounts with activity in the
              last hour are skipped.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap items-end gap-3">
              <div className="flex flex-wrap gap-2">
                {FILTERS.map((f) => (
                  <Button key={f.value} size="sm" variant={filter === f.value ? "default" : "outline"} onClick={() => setFilter(f.value)}>
                    {f.label}
                  </Button>
                ))}
              </div>
              <div className="space-y-1">
                <Label htmlFor="sweep-min">Minimum to move (₦)</Label>
                <Input id="sweep-min" type="number" min="1" className="w-32" value={minAmount} onChange={(e) => setMinAmount(e.target.value)} />
              </div>
              <Button
                size="sm"
                variant="outline"
                disabled={!scanDone}
                onClick={() => setSelected(defaultSelection(scan.rows, min))}
              >
                Tick all safe rows
              </Button>
              <Button size="sm" variant="outline" onClick={() => setSelected(new Set())}>Clear</Button>
            </div>

            <div className="max-h-[560px] overflow-auto rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead />
                    <TableHead>User</TableHead>
                    <TableHead>Account</TableHead>
                    <TableHead className="text-right">SafeHaven</TableHead>
                    <TableHead className="text-right">App</TableHead>
                    <TableHead className="text-right">Extra</TableHead>
                    <TableHead className="text-right">Recorded spend</TableHead>
                    <TableHead>Last activity</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visible.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center text-muted-foreground">No accounts in this view</TableCell>
                    </TableRow>
                  )}
                  {visible.map((r) => {
                    const result = sweep.results[r.email];
                    const sweepable = isSweepable(r, min) && !result;
                    return (
                      <TableRow key={r.email}>
                        <TableCell>
                          <Checkbox
                            checked={selected.has(r.email) && sweepable}
                            disabled={!sweepable || !scanDone || sweep.running}
                            onCheckedChange={(on) => toggle(r.email, on === true)}
                          />
                        </TableCell>
                        <TableCell className="max-w-[220px] truncate" title={r.email}>{r.email}</TableCell>
                        <TableCell className="font-mono text-xs">{r.accountNumber}</TableCell>
                        <TableCell className="text-right">{formatNaira(r.safeHavenBalance)}</TableCell>
                        <TableCell className="text-right">{formatNaira(r.appBalance)}</TableCell>
                        <TableCell
                          className={`text-right font-medium ${r.gap === null ? "" : r.gap > 0 ? "text-green-600" : r.gap < 0 ? "text-red-600" : ""}`}
                        >
                          {formatNaira(r.gap)}
                        </TableCell>
                        <TableCell className="text-right">{formatNaira(r.unsettledSpend)}</TableCell>
                        <TableCell className="whitespace-nowrap text-xs">{r.lastActivity ?? "—"}</TableCell>
                        <TableCell className="space-x-1 whitespace-nowrap">
                          {result && (
                            <Badge variant={RESULT_VARIANT[result.status]} title={result.message}>
                              {result.status}
                              {result.amount ? ` ${formatNaira(result.amount)}` : ""}
                            </Badge>
                          )}
                          {r.error && <Badge variant="destructive" title={r.error}>unreadable</Badge>}
                          {r.recentActivity && <Badge variant="outline">active last hour</Badge>}
                          {needsReview(r) && <Badge variant="outline" title="Extra is more than recorded spending">needs review</Badge>}
                          {r.gap !== null && r.gap < 0 && <Badge variant="destructive">short</Badge>}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            <div className="space-y-3 rounded-lg bg-muted p-4">
              <div className="space-y-1">
                <Label htmlFor="sweep-reason">Reason (audit log)</Label>
                <Textarea
                  id="sweep-reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Monthly fee settlement for personal accounts, November 2026."
                />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
                <span>
                  Selected: <strong>{chosen.length}</strong> accounts, <strong>{formatNaira(chosenTotal)}</strong> to settlement
                  account <span className="font-mono">{scan.settlementAccount ?? "—"}</span>
                </span>
                <Button
                  variant="destructive"
                  disabled={!scanDone || sweep.running || chosen.length === 0 || reason.trim().length < 5}
                  onClick={() => setConfirming(true)}
                >
                  {sweep.running ? "Moving…" : "Move to settlement"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <SweepHistory />

      <Dialog
        open={confirming}
        onOpenChange={(open) => {
          setConfirming(open);
          if (!open) setTyped("");
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Move real money</DialogTitle>
            <DialogDescription>
              This sends SafeHaven transfers from {chosen.length} users&apos; own accounts to the settlement account. App
              wallets do not change. Each account is checked again just before its transfer, and never more than the
              amount shown here is moved.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 text-sm">
            <p>Accounts: <strong>{chosen.length}</strong></p>
            <p>Total: <strong>{formatNaira(chosenTotal)}</strong></p>
            <p>To: <span className="font-mono">{scan.settlementAccount}</span></p>
            <Label htmlFor="sweep-confirm">Type MOVE to confirm</Label>
            <Input id="sweep-confirm" value={typed} onChange={(e) => setTyped(e.target.value)} autoComplete="off" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirming(false)}>Cancel</Button>
            <Button variant="destructive" disabled={typed !== "MOVE"} onClick={confirm}>
              Move {formatNaira(chosenTotal)}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
