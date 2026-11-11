import type { SweepAccountRow } from "../types/settlementSweep";
import { round2 } from "./walletAdjustments";

export const SCAN_PAGE_SIZE = 25;
export const SWEEP_CHUNK_SIZE = 5;

export interface SweepTotals {
  accounts: number;
  checked: number;
  failed: number;
  safeHaven: number;
  app: number;
  /** Sum of every positive gap: money we could move to settlement. */
  extra: number;
  extraAccounts: number;
  /** Sum of every negative gap, as a positive number: money users are short. */
  short: number;
  shortAccounts: number;
}

export const summarizeScan = (rows: SweepAccountRow[]): SweepTotals => {
  const totals: SweepTotals = {
    accounts: rows.length, checked: 0, failed: 0, safeHaven: 0, app: 0,
    extra: 0, extraAccounts: 0, short: 0, shortAccounts: 0,
  };
  for (const row of rows) {
    if (row.safeHavenBalance === null || row.gap === null) {
      totals.failed++;
      continue;
    }
    totals.checked++;
    totals.safeHaven += row.safeHavenBalance;
    totals.app += row.appBalance;
    if (row.gap > 0) {
      totals.extra += row.gap;
      totals.extraAccounts++;
    } else if (row.gap < 0) {
      totals.short += -row.gap;
      totals.shortAccounts++;
    }
  }
  for (const key of ["safeHaven", "app", "extra", "short"] as const) totals[key] = round2(totals[key]);
  return totals;
};

/**
 * A row needs a human look when the extra money is more than the spending the app
 * recorded: the difference could be a deposit we never credited, which is the user's money.
 */
export const needsReview = (row: SweepAccountRow) =>
  row.gap !== null && row.gap > 0 && row.gap > row.unsettledSpend + 1;

/** Whether a row can be ticked for a sweep at all. */
export const isSweepable = (row: SweepAccountRow, minAmount: number) =>
  row.gap !== null && row.gap >= Math.max(minAmount, 1) && !row.recentActivity && !row.error;

/** Rows ticked by default: sweepable and fully explained by recorded spending. */
export const defaultSelection = (rows: SweepAccountRow[], minAmount: number) =>
  new Set(rows.filter((r) => isSweepable(r, minAmount) && !needsReview(r)).map((r) => r.email));

export const chunk = <T,>(items: T[], size: number): T[][] => {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
};
