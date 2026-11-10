import { describe, expect, it } from "vitest";
import { formatNaira, validateAdjustment, walletChangeFor } from "./walletAdjustments";

const base = { kind: "credit" as const, amount: 39800, fee: 50, reason: "Missed deposit", remark: "Wallet funding credited.", reference: "", balance: 53.08 };

describe("walletChangeFor", () => {
  it("credits the amount minus the fee", () => expect(walletChangeFor("credit", 39800, 50)).toBe(39750));
  it("refunds the amount plus the fee", () => expect(walletChangeFor("refund", 10000, 50)).toBe(10050));
  it("debits the amount plus the fee", () => expect(walletChangeFor("debit", 150, 0)).toBe(-150));
  it("ignores invalid amounts", () => expect(walletChangeFor("credit", NaN, 0)).toBe(0));
});

describe("validateAdjustment", () => {
  it("accepts a valid credit", () => expect(validateAdjustment(base)).toBeNull());
  it("rejects a fee as large as the credit", () => expect(validateAdjustment({ ...base, amount: 50 })).toMatch(/fee/));
  it("requires a reason", () => expect(validateAdjustment({ ...base, reason: "x" })).toMatch(/reason/));
  it("requires a user note", () => expect(validateAdjustment({ ...base, remark: "" })).toMatch(/note/));
  it("rejects bad references", () => expect(validateAdjustment({ ...base, reference: "abc def" })).toMatch(/reference/));
  it("blocks debits larger than the balance", () =>
    expect(validateAdjustment({ ...base, kind: "debit", amount: 100, fee: 0, balance: 53.08 })).toMatch(/more than the wallet/));
});

describe("formatNaira", () => {
  it("formats numbers and strings", () => expect(formatNaira("39803.08")).toBe("₦39,803.08"));
  it("shows a dash for missing values", () => expect(formatNaira(null)).toBe("—"));
});
