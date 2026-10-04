export interface SavingsTransactionType {
  id: number;
  reference: string;

  first_name: string;
  last_name: string;
  user_tag: string;
  userID: string;
  user_flagged: boolean;

  amount: string;
  balance_before: string;
  balance_after: string;
  interest_rate: string;

  category: string;
  type: "credit" | "debit";
  plan_type: string;
  account_status: string;

  created_at: string;
  savings_account_id: number;
}

export interface SavingsTransactionDetails {
  id?: number | null;
  userID?: string | null;
  savings_account_id?: number | null;
  transaction_type?: string | null;
  transaction_category?: string | null;
  amount?: string | number | null;
  balance_before?: string | number | null;
  balance_after?: string | number | null;
  reference?: string | null;
  transaction_created_at?: string | null;
  plan_type?: string | null;
  current_plan_balance?: string | number | null;
  interest_rate?: string | number | null;
  plan_status?: string | null;
  plan_meta_data?: {
    name?: string | null;
    durationDays?: number | null;
    maturityDate?: string | null;
    interestAmount?: string | number | null;
    interestPayoutMode?: string | null;
    upfrontInterestPaid?: boolean | null;
  } | null;
  plan_created_at?: string | null;
  user_uuid?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  phone_number?: string | null;
  user_tag?: string | null;
  user_flagged?: boolean | null;
}
