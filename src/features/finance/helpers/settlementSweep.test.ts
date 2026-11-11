import { describe, expect, it } from "vitest";
import { chunk, defaultSelection, isSweepable, needsReview, summarizeScan } from "./settlementSweep";
import type { SweepAccountRow } from "../types/settlementSweep";

const row = (over: Partial<SweepAccountRow>): SweepAccountRow => ({
  email: "a@t.co", accountNumber: "1", accountName: "A", appBalance: 900, unsettledSpend: 100,
  lastActivity: null, recentActivity: false, safeHavenBalance: 1000, gap: 100, ...over,
});

describe("summarizeScan", () => {
  it("adds up balances, extra and short separately", () => {
    const t = summarizeScan([
      row({}),
      row({ email: "b", appBalance: 600, safeHavenBalance: 500, gap: -100 }),
      row({ email: "c", safeHavenBalance: null, gap: null, error: "down" }),
    ]);
    expect(t).toMatchObject({ accounts: 3, checked: 2, failed: 1, safeHaven: 1500, app: 1500, extra: 100, extraAccounts: 1, short: 100, shortAccounts: 1 });
  });
});

describe("needsReview", () => {
  it("is false when recorded spending explains the extra", () => expect(needsReview(row({}))).toBe(false));
  it("is true when the extra is more than recorded spending", () => expect(needsReview(row({ gap: 5000 }))).toBe(true));
  it("is false when the user is short", () => expect(needsReview(row({ gap: -10 }))).toBe(false));
});

describe("isSweepable", () => {
  it("needs a gap of at least the minimum", () => expect(isSweepable(row({ gap: 0.5 }), 0)).toBe(false));
  it("skips accounts with recent activity", () => expect(isSweepable(row({ recentActivity: true }), 1)).toBe(false));
  it("skips accounts SafeHaven could not read", () => expect(isSweepable(row({ gap: null, error: "x" }), 1)).toBe(false));
  it("accepts a normal extra", () => expect(isSweepable(row({}), 50)).toBe(true));
});

describe("defaultSelection", () => {
  it("ticks only safe rows", () => {
    const s = defaultSelection([row({}), row({ email: "big", gap: 5000 }), row({ email: "short", gap: -1 })], 1);
    expect([...s]).toEqual(["a@t.co"]);
  });
});

describe("chunk", () => {
  it("splits into groups", () => expect(chunk([1, 2, 3, 4, 5, 6, 7], 5)).toEqual([[1, 2, 3, 4, 5], [6, 7]]));
});
