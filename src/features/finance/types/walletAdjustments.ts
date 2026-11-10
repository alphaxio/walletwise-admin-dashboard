export type AdjustmentKind = "credit" | "debit" | "refund";

export interface WalletTransaction {
  id: number;
  status: string;
  type: "credit" | "debit";
  amount: string;
  fee: string;
  product_name: string | null;
  transaction_id: string | null;
  balance: string | null;
  date: string;
  remark: string | null;
  biller_ref: string | null;
  user_email?: string;
}

export interface WalletOverview {
  user: { email: string; name: string; userTag: string | null; phoneNumber: string | null };
  appWallet: { balance: number | null; previousBalance: number | null };
  bankAccount: { accountNumber: string; accountName: string } | null;
  safeHaven:
    | { accountNumber: string; accountName: string; accountBalance: number; bookBalance: number; status: string; gap: number | null }
    | { error: string }
    | null;
  transactions: WalletTransaction[];
}

export interface SessionLookup {
  sessionId: string;
  safeHaven: {
    found: boolean;
    message?: string;
    type?: string;
    amount?: number;
    responseCode?: string | null;
    responseMessage?: string | null;
    isReversed?: boolean;
    creditAccountNumber?: string;
    creditAccountName?: string;
    debitAccountName?: string;
    createdAt?: string;
  };
  ourRecords: WalletTransaction[];
}

export interface AdjustmentInput {
  userEmail: string;
  kind: AdjustmentKind;
  amount: number;
  fee: number;
  reason: string;
  remark: string;
  reference?: string;
  date?: string;
  recipientAccount?: string;
  bankName?: string;
  counterpartyName?: string;
}

export interface Adjustment {
  id: number;
  admin_email: string;
  user_email: string;
  kind: AdjustmentKind;
  amount: string;
  fee: string;
  wallet_change: string;
  balance_before: string;
  balance_after: string;
  reason: string;
  remark: string;
  reference: string;
  created_at: string;
}
