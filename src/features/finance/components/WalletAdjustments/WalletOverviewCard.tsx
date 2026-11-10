"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { WalletOverview } from "../../types/walletAdjustments";
import { formatNaira } from "../../helpers/walletAdjustments";

const Stat = ({ label, value, hint }: { label: string; value: string; hint?: string }) => (
  <div className="rounded-lg border p-4">
    <p className="text-xs uppercase text-muted-foreground">{label}</p>
    <p className="mt-1 text-xl font-semibold">{value}</p>
    {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
  </div>
);

const SafeHavenStat = ({ overview }: { overview: WalletOverview }) => {
  const { safeHaven, bankAccount } = overview;
  if (!bankAccount) {
    return (
      <Stat
        label="SafeHaven"
        value="Pool user"
        hint="No permanent account. Deposits come through temporary virtual accounts into the pool."
      />
    );
  }
  if (!safeHaven || "error" in safeHaven) {
    return (
      <Stat
        label={`SafeHaven ${bankAccount.accountNumber}`}
        value="Unavailable"
        hint={safeHaven && "error" in safeHaven ? safeHaven.error : "Could not reach SafeHaven"}
      />
    );
  }
  const gap = safeHaven.gap ?? 0;
  return (
    <Stat
      label={`SafeHaven ${safeHaven.accountNumber}`}
      value={formatNaira(safeHaven.accountBalance)}
      hint={
        Math.abs(gap) < 0.01
          ? "Matches the app wallet"
          : `${gap > 0 ? "SafeHaven is higher" : "App wallet is higher"} by ${formatNaira(Math.abs(gap))}`
      }
    />
  );
};

export default function WalletOverviewCard({ overview }: { overview: WalletOverview }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {overview.user.name || overview.user.email}
          <span className="ml-2 text-sm font-normal text-muted-foreground">
            {overview.user.email}
            {overview.user.userTag ? ` · @${overview.user.userTag}` : ""}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <Stat label="App wallet" value={formatNaira(overview.appWallet.balance)} />
          <Stat label="Previous balance" value={formatNaira(overview.appWallet.previousBalance)} />
          <SafeHavenStat overview={overview} />
        </div>

        <div>
          <h3 className="mb-2 text-sm font-semibold">Last 20 transactions</h3>
          <div className="overflow-x-auto rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Fee</TableHead>
                  <TableHead className="text-right">Balance after</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>Note</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {overview.transactions.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-muted-foreground">
                      No transactions
                    </TableCell>
                  </TableRow>
                )}
                {overview.transactions.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell className="whitespace-nowrap">{tx.date}</TableCell>
                    <TableCell>{tx.product_name || tx.type}</TableCell>
                    <TableCell>
                      <Badge variant={tx.status === "success" ? "secondary" : "outline"}>{tx.status}</Badge>
                    </TableCell>
                    <TableCell className={`text-right ${tx.type === "credit" ? "text-green-600" : ""}`}>
                      {tx.type === "credit" ? "+" : "−"}
                      {formatNaira(tx.amount)}
                    </TableCell>
                    <TableCell className="text-right">{formatNaira(tx.fee)}</TableCell>
                    <TableCell className="text-right">{formatNaira(tx.balance)}</TableCell>
                    <TableCell className="max-w-[180px] truncate font-mono text-xs" title={tx.transaction_id ?? ""}>
                      {tx.transaction_id}
                    </TableCell>
                    <TableCell className="max-w-[220px] truncate" title={tx.remark ?? ""}>
                      {tx.remark || tx.biller_ref}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
