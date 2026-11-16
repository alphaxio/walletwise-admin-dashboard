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
  status: 'success' | 'failed' | 'pending';
}
export interface ActivityBucket {
  label: string;
  received: number;
  spent: number;
}
