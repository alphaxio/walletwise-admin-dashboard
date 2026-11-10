"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Textarea } from "@/components/ui/textarea";
import type { AdjustmentKind, WalletOverview } from "../../types/walletAdjustments";
import { useCreateAdjustment } from "../../hooks/useWalletAdjustments";
import {
  ADJUSTMENT_KIND_OPTIONS,
  formatNaira,
  round2,
  validateAdjustment,
  walletChangeFor,
} from "../../helpers/walletAdjustments";

export interface AdjustmentPrefill {
  reference: string;
  amount?: number;
}

const emptyForm = {
  kind: "credit" as AdjustmentKind,
  amount: "",
  fee: "0",
  reason: "",
  remark: "",
  reference: "",
  date: "",
  recipientAccount: "",
  bankName: "",
  counterpartyName: "",
};

export default function AdjustmentForm({
  overview,
  prefill,
}: {
  overview: WalletOverview;
  prefill: AdjustmentPrefill | null;
}) {
  const [form, setForm] = useState(() => ({
    ...emptyForm,
    reference: prefill?.reference ?? "",
    amount: prefill?.amount ? String(prefill.amount) : "",
  }));
  const [confirming, setConfirming] = useState(false);

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const amount = round2(Number(form.amount));
  const fee = round2(Number(form.fee || 0));
  const balance = overview.appWallet.balance;
  const change = walletChangeFor(form.kind, amount, fee);
  const error = validateAdjustment({ ...form, amount, fee, balance });

  const { mutate, isPending } = useCreateAdjustment(
    () => {
      setConfirming(false);
      setForm(emptyForm);
    },
    () => setConfirming(false)
  );

  const submit = () =>
    mutate({
      userEmail: overview.user.email,
      kind: form.kind,
      amount,
      fee,
      reason: form.reason.trim(),
      remark: form.remark.trim(),
      reference: form.reference.trim() || undefined,
      date: form.date || undefined,
      recipientAccount: form.recipientAccount.trim() || undefined,
      bankName: form.bankName.trim() || undefined,
      counterpartyName: form.counterpartyName.trim() || undefined,
    });

  const kindOption = ADJUSTMENT_KIND_OPTIONS.find((o) => o.value === form.kind)!;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Credit or debit the app wallet</CardTitle>
        <CardDescription>
          Changes the WalletWise app balance only. No money moves on SafeHaven. Every change is logged with your name.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {ADJUSTMENT_KIND_OPTIONS.map((o) => (
            <Button
              key={o.value}
              type="button"
              variant={form.kind === o.value ? "default" : "outline"}
              onClick={() => setForm((f) => ({ ...f, kind: o.value }))}
            >
              {o.label}
            </Button>
          ))}
        </div>
        <p className="text-sm text-muted-foreground">{kindOption.help}</p>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <Label htmlFor="adj-amount">Amount (₦)</Label>
            <Input id="adj-amount" type="number" min="0" step="0.01" value={form.amount} onChange={set("amount")} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="adj-fee">Fee (₦)</Label>
            <Input id="adj-fee" type="number" min="0" step="0.01" value={form.fee} onChange={set("fee")} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="adj-reference">Session ID / reference (optional)</Label>
            <Input
              id="adj-reference"
              className="font-mono"
              value={form.reference}
              onChange={set("reference")}
              placeholder="Use the real session ID so it can never be applied twice"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="adj-date">Show in history at (optional, Lagos time)</Label>
            <Input id="adj-date" type="datetime-local" value={form.date} onChange={set("date")} />
          </div>
          {form.kind === "refund" && (
            <>
              <div className="space-y-1">
                <Label htmlFor="adj-recipient">Recipient account</Label>
                <Input id="adj-recipient" value={form.recipientAccount} onChange={set("recipientAccount")} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="adj-bank">Recipient bank</Label>
                <Input id="adj-bank" value={form.bankName} onChange={set("bankName")} />
              </div>
            </>
          )}
          <div className="space-y-1 sm:col-span-2">
            <Label htmlFor="adj-counterparty">
              {form.kind === "credit" ? "Sender name (optional)" : "Recipient name (optional)"}
            </Label>
            <Input id="adj-counterparty" value={form.counterpartyName} onChange={set("counterpartyName")} />
          </div>
          <div className="space-y-1 sm:col-span-2">
            <Label htmlFor="adj-remark">Note the user sees in their history</Label>
            <Input
              id="adj-remark"
              value={form.remark}
              onChange={set("remark")}
              placeholder="e.g. Transfer reversed. N10,050 refunded to your wallet."
            />
          </div>
          <div className="space-y-1 sm:col-span-2">
            <Label htmlFor="adj-reason">Internal reason (audit log only)</Label>
            <Textarea
              id="adj-reason"
              value={form.reason}
              onChange={set("reason")}
              placeholder="e.g. Deposit to virtual account 6011199910 confirmed by SafeHaven (Blessing, 10 Nov), webhook never arrived."
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg bg-muted p-4 text-sm">
          <span>
            Wallet: <strong>{formatNaira(balance)}</strong> →{" "}
            <strong>{balance === null ? "—" : formatNaira(round2(balance + change))}</strong>{" "}
            <span className={change >= 0 ? "text-green-600" : "text-red-600"}>
              ({change >= 0 ? "+" : "−"}
              {formatNaira(Math.abs(change))})
            </span>
          </span>
          <Button type="button" disabled={!!error || isPending} onClick={() => setConfirming(true)}>
            Review
          </Button>
        </div>
        {error && form.amount && <p className="text-sm text-red-600">{error}</p>}
      </CardContent>

      <Dialog open={confirming} onOpenChange={(open) => !isPending && setConfirming(open)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm {kindOption.label.toLowerCase()}</DialogTitle>
            <DialogDescription>This changes a real customer balance. Check every line.</DialogDescription>
          </DialogHeader>
          <div className="space-y-1 text-sm">
            <p>User: <strong>{overview.user.email}</strong></p>
            <p>
              Amount {formatNaira(amount)}, fee {formatNaira(fee)}
            </p>
            <p>
              Wallet: {formatNaira(balance)} → <strong>{formatNaira(round2((balance ?? 0) + change))}</strong>
            </p>
            <p>Reference: <span className="font-mono">{form.reference.trim() || "auto-generated"}</span></p>
            <p>User sees: “{form.remark.trim()}”</p>
          </div>
          <DialogFooter>
            <Button variant="outline" disabled={isPending} onClick={() => setConfirming(false)}>
              Cancel
            </Button>
            <Button variant={change < 0 ? "destructive" : "default"} disabled={isPending} onClick={submit}>
              {isPending ? "Saving…" : `Confirm ${change >= 0 ? "+" : "−"}${formatNaira(Math.abs(change))}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
