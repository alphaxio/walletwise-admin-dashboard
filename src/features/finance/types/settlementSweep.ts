export interface SweepAccountRow {
  email: string;
  accountNumber: string;
  accountName: string;
  appBalance: number;
  /** Card and other spending the app recorded but has not yet moved out of the account. */
  unsettledSpend: number;
  lastActivity: string | null;
  recentActivity: boolean;
  safeHavenBalance: number | null;
  /** SafeHaven balance minus app balance. Positive means extra money in the account. */
  gap: number | null;
  error?: string;
}

export interface SweepScanPage {
  items: SweepAccountRow[];
  total: number;
  offset: number;
  limit: number;
  settlementAccount: string;
}

export type SweepStatus = "success" | "failed" | "unknown" | "skipped";

export interface SweepResult {
  email: string;
  status: SweepStatus;
  amount?: number;
  sessionId?: string | null;
  paymentReference?: string;
  message: string;
}

export interface SweepRunInput {
  batchId: string;
  reason: string;
  items: { email: string; amount: number }[];
}

export interface SweepRunResponse {
  results: SweepResult[];
  movedTotal: number;
  settlementAccount: string;
}

export interface SweepRecord {
  id: number;
  batch_id: string;
  admin_email: string;
  user_email: string;
  account_number: string;
  safehaven_balance: string;
  app_balance: string;
  amount: string;
  destination_account: string;
  payment_reference: string;
  status: Exclude<SweepStatus, "skipped"> | "pending";
  session_id: string | null;
  message: string | null;
  reason: string;
  created_at: string;
}
