import type { AdjustmentKind } from "../types/walletAdjustments";

export const ADJUSTMENT_KIND_OPTIONS: { value: AdjustmentKind; label: string; help: string }[] = [
  {
    value: "credit",
    label: "Credit",
    help: "Money in, e.g. a deposit that was never credited. The wallet gets the amount minus the fee.",
  },
  {
    value: "refund",
    label: "Refund failed transfer",
    help: "Records the failed transfer in the user's history as reversed and returns the amount plus the fee.",
  },
  {
    value: "debit",
    label: "Debit",
    help: "Money out, e.g. reversing a duplicate credit. The wallet loses the amount plus the fee.",
  },
];

/** How much the wallet balance changes: positive for money in, negative for money out. */
export const walletChangeFor = (kind: AdjustmentKind, amount: number, fee: number): number => {
  if (!Number.isFinite(amount) || amount <= 0) return 0;
  const safeFee = Number.isFinite(fee) && fee > 0 ? fee : 0;
  if (kind === "credit") return round2(amount - safeFee);
  if (kind === "refund") return round2(amount + safeFee);
  return -round2(amount + safeFee);
};

export const round2 = (value: number) => Math.round(value * 100) / 100;

export const formatNaira = (value: number | string | null | undefined) => {
  const n = Number(value);
  if (value === null || value === undefined || !Number.isFinite(n)) return "—";
  return `₦${n.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export const SESSION_ID_PATTERN = /^[A-Za-z0-9-]{6,100}$/;

/** Returns the first problem with the form, or null when it can be submitted. */
export const validateAdjustment = (input: {
  kind: AdjustmentKind;
  amount: number;
  fee: number;
  reason: string;
  remark: string;
  reference: string;
  balance: number | null;
}): string | null => {
  if (!Number.isFinite(input.amount) || input.amount <= 0) return "Enter an amount greater than 0";
  if (!Number.isFinite(input.fee) || input.fee < 0) return "The fee cannot be negative";
  if (input.kind === "credit" && input.fee >= input.amount) return "The fee must be smaller than the amount";
  if (input.reason.trim().length < 5) return "Give a reason (at least 5 characters) for the audit log";
  if (input.remark.trim().length < 3) return "Enter the note the user will see in their history";
  if (input.reference.trim() && !SESSION_ID_PATTERN.test(input.reference.trim()))
    return "The reference can only contain letters, numbers and dashes";
  const change = walletChangeFor(input.kind, input.amount, input.fee);
  if (input.balance !== null && input.balance + change < 0)
    return `This debit is more than the wallet balance (${formatNaira(input.balance)})`;
  return null;
};
