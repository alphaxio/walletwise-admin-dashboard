export type ActivityPeriod = 'daily' | 'weekly' | 'monthly';
export type ActivityKind = 'received' | 'spent' | 'session' | 'event';
export interface UserActivityRecord {
  id: string;
  occurredAt: string;
  description: string;
  amountMinor: number | null;
  kind: ActivityKind;
  channel: string;
  service: string;
  status: 'success' | 'failed' | 'pending' | 'reversed';
}
export interface ActivityBucket {
  label: string;
  received: number;
  spent: number;
}

export interface ActivitySummaryData {
  received: number;
  spent: number;
  transactions: number;
  failed: number;
  sessions: number | null;
  pending: number;
}
export interface ActivityContextData {
  walletBalanceMinor: number | null;
  lastActiveAt: string | null;
  streak: string | null;
  checkInProgress: string | null;
  device: string | null;
  kyc: string | null;
  tier: string | null;
}
export interface ActivityResponse {
  summary: ActivitySummaryData;
  comparison: { received: number | null; spent: number | null; transactions: number | null; sessions: number | null };
  context: ActivityContextData | null;
  buckets: { label: string; received: number; spent: number }[];
  services: { service: string; amountMinor: number; color: string; sharePercent: number }[];
  records: UserActivityRecord[];
  recordsTruncated: boolean;
  period: ActivityPeriod;
  date: string;
  range: { start: string; end: string };
}
