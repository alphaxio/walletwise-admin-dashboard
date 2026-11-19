import { ColumnDef } from "@tanstack/react-table";
import { FormEvent } from "react";

interface ApiErrorData {
  message?: string;
  errors?: { message?: string }[];
}

export interface ApiErrorResponse {
  response?: {
    data?: ApiErrorData;
  };
}

export interface DateOptions {
  year?: "numeric" | "2-digit" | undefined;
  month?: "numeric" | "2-digit" | "short" | "long" | "narrow" | undefined;
  day?: "numeric" | "2-digit" | undefined;
  hour?: "numeric" | "2-digit" | undefined;
  minute?: "numeric" | "2-digit" | undefined;
  hour12?: boolean;
}

export interface fetchDataProps {
  currentPage: number;
  limit: number;
  status?: string;
  search: string | null;
  filter?: {
    [key: number]: string;
  };
  tier?: number;
  service?: string;
  transferType?: string;
  exclude?: boolean;
  selectedDateFilterValue?: DateFilterValue | null;
}

export interface TableWrapperProps<TData = unknown> {
  columns: ColumnDef<TData>[];
  data: TData[];
  totalPages: number;
  currentPage: number;
  prevPage: () => void;
  nextPage: (totalPages: number) => void;
  goToLastPage: (totalPages: number) => void;
  goToFirstPage: () => void;
  isFirstPage: () => boolean;
  isLastPage: (totalPages: number) => boolean;
  limit: number;
  setLimit: (limit: number) => void;
  setSelectedDateFilterValue?: (value: DateFilterValue) => void;
  refetch?: () => void;
  handleSortChange?: (values: { [key: number]: string }) => void;
  search?: string | number;
  handleChange?: (search: string) => void;
  handleClear?: () => void;
  onSubmit?: (e: FormEvent) => void;
  sortOptions?: SortOption[];
  setCurrentPage?: (page: number) => void;
  isLoading?: boolean;
  showExport?: boolean;
}

export interface optionsType {
  label: string;
  value: string;
  color?: string;
}

export interface fetchDataProps {
  currentPage: number;
  limit: number;
  verified?: string;
  search: string | null;
  status?: string;
  eventId?: string;
}

export interface TabType {
  value: string;
  label: string;
  content: React.ReactElement;
}

export interface StatusCount {
  failed: number;
  pending: number;
  reversed: number;
  success: number;
}

export interface SummaryProps {
  statusCount: StatusCount;
  totalRevenue: number;
  totalCompanyCommission: number;
  totalTransactions: number;
  totalUserCommission: number;
  isLoading: boolean;
  totalAmountUsd?: number;
  totalCommissionUsd?: number;
  onClick: (value: string) => void;
  service: string;
}

export interface HistoryProps<TData = unknown> {
  statusCount: StatusCount;
  totalRevenue: number;
  totalCompanyCommission: number;
  totalTransactions: number;
  totalUserCommission: number;
  totalAmountUsd?: number;
  totalCommissionUsd?: number;
  isLoading: boolean;
  onClick: (value: string) => void;
  data: TData[];
  totalPages: number;
  currentPage: number;
  prevPage: () => void;
  nextPage: (totalPages: number) => void;
  goToLastPage: (totalPages: number) => void;
  goToFirstPage: () => void;
  isFirstPage: () => boolean;
  isLastPage: (totalPages: number) => boolean;
  limit: number;
  setLimit: (limit: number) => void;
  setSelectedDateFilterValue: (value: DateFilterValue) => void;
  refetch: () => void;
  handleSortChange: (values: { [key: number]: string }) => void;
  search?: string | number;
  handleChange?: (search: string) => void;
  handleClear?: () => void;
  onSubmit?: (e: FormEvent) => void;
  sortOptions?: SortOption[];
  service: string;
  handleSwitchTransferType?: (value: string) => void;
  transferType?: string;
  setCurrentPage: (page: number) => void;
}

export interface TransactionDetail {
  brand: string;
  ref_id: string;
  card_id: string;
  currency: string;
  trans_id: string;
  billerRef: string;
  card_name: string;
  amount_ngn: string;
  amount_usd: string;
  new_balance: string;
  prev_balance: string;
  exchange_rate: number;
  provider_rate: number;
  quote_trans_id: string;
}

export interface TransactionType {
  id: number;
  userID: string;
  status: string;
  type: string;
  asset_id: string;
  category: string;
  amount: string;
  fee: string;
  commission: string;
  date: string;
  product_name: string;
  transaction_id: string;
  details: TransactionDetail;
  balance: string;
  company_commission: string;
  user_commission: string;
  user_id: string;
  user_tag: string;
  first_name: string;
  last_name: string;
  full_name: string;
  user_flagged: boolean;
}

export type FilterOption =
  | "yesterday"
  | "today"
  | "last7days"
  | "thisWeek"
  | "lastWeek"
  | "thisMonth"
  | "lastMonth"
  | "last6Months"
  | "thisYear"
  | "lastYear"
  | "custom";

export interface DateRange {
  start: Date;
  end: Date;
}

export interface DateFilterValue {
  label: FilterOption;
  dateRange: DateRange;
}

export interface SortOption {
  label: string;
  values: string[];
}

export interface SelectedValues {
  [optionIndex: number]: string;
}

export interface SortDropdownProps {
  sortOptions?: SortOption[];
  onSortChange?: (values: SelectedValues) => void;
  placeholder?: string;
  className?: string;
  onFilter?: () => void;
}

type TransactionMetric = {
  count: number;
  volume: number;
};

type ServiceMetrics = {
  airtime: TransactionMetric;
  betting: TransactionMetric;
  cable: TransactionMetric;
  card_creation: TransactionMetric;
  card_topup: TransactionMetric;
  card_withdrawal: TransactionMetric;
  card_refund: TransactionMetric;
  data: TransactionMetric;
  electricity: TransactionMetric;
  esim: TransactionMetric;
  education: TransactionMetric;
  giftcard: TransactionMetric;
  giftcard_redeem: TransactionMetric;
  transfer: TransactionMetric;
};

type Totals = {
  commission_transactions: number;
  count: number;
  profit: number;
  revenue: number;
  user_commission: number;
};

export type UserCommissionAnalytics = {
  id: string;
  user_tag: string;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  phone_number: string;
  referral_count: number;
  created_at: string;
  services: ServiceMetrics;
  totals: Totals;
};

export type StreakAnalytics = {
  id: string;
  fullName: string;
  userTag: string;
  email: string;
  currentStreak: number;
  totalCompletedStreaks: number;
  totalCheckins: number;
  lastCheckinDate: string;
  individualEarnings: number;
};

export interface EarningTableData {
  category: string;
  date: string;
  total_profit: number;
  total_revenue: number;
}

export type ReferralUser = {
  id: string;
  user_tag: string;
  first_name: string;
  last_name: string;
  referred_by: string | null;
  referral_count: number;
  created_at: string;
  latest_referral_date: string | null;
};

export type TransactionDetails = {
  bankName: string;
  billerRef: string;
  recepientAcc: string;
  remark: string;
  requestID?: string;
  token?: string;
  units?: string;
  customerName?: string;
  customerAddress?: string;
  pinNumber?: string;
  senderAcc?: string;
};

export type TransactionUser = {
  id: string;
  user_tag: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  created_at: string;
};

export type WalletTransaction = {
  id: number;
  transaction_id: string;
  product_name: string;
  category: string;
  type: string;
  status: string;
  asset_id: string;
  amount: string;
  fee: string;
  commission: string;
  balance: string;
  date: string;
  details: TransactionDetails;
  user: TransactionUser;
  user_flagged: boolean;
};

export interface Notification {
  id: string;
  subject: string;
  message: string;
  admin_id: string;
  notification_type: string;
  created_at: string;
  updated_at: string;
  created_by: CreatedBy;
}

export interface CreatedBy {
  first_name: string;
  last_name: string;
  email: string;
  full_name: string;
  role: string;
}

export interface TiersType {
  tier1: number;
  tier2: number;
  tier3: number;
}

export interface KYCTableData {
  bvn_status: string;
  error_reason: string | null;
  id: number;
  identity_status: string;
  nin_status: string;
  submission_date: null | number;
  tier: string;
  userID: string;
  verification_date: null | number;
}

export interface KYCDetails {
  idType: string;
  idNumber: string;
  validIDImage: string;
  passportImage: string;
  proofOfAddressImage: string;
}

export interface KYCData {
  id: number;
  userID: string;
  bvn_status: string;
  nin_status: string;
  identity_status: string;
  tier: string;
  error_reason: string | null;
  submission_date: string | null;
  verification_date: string | null;
  kyc_details: KYCDetails;
}

export interface NotificationPayload {
  type?: string;
  title?: string;
  message?: string;
  data?: Record<string, unknown>;
  timestamp?: string;
}

export type serviceType =
  | "airtime"
  | "betting"
  | "cable"
  | "data"
  | "education"
  | "electricity"
  | "esim"
  | "giftcard"
  | "gift-redeem"
  | "transfer"
  | "virtual-card"
  | "card-creation"
  | "book-flight"
  | "hotel-reservations";

export type RevenueRow = {
  period: string;
} & Partial<Record<serviceType, number>>;

export interface CommissionTableProps<TData = unknown> {
  isLoading: boolean;
  data: TData[];
  totalPages: number;
  currentPage: number;
  prevPage: () => void;
  nextPage: (totalPages: number) => void;
  goToLastPage: (totalPages: number) => void;
  goToFirstPage: () => void;
  isFirstPage: () => boolean;
  isLastPage: (totalPages: number) => boolean;
  limit: number;
  setLimit: (limit: number) => void;
  setSelectedDateFilterValue: (value: DateFilterValue) => void;
  refetch: () => void;
  handleSortChange: (values: { [key: number]: string }) => void;
  search?: string | number;
  handleChange?: (search: string) => void;
  handleClear?: () => void;
  onSubmit?: (e: FormEvent) => void;
  setCurrentPage: (page: number) => void;
}
