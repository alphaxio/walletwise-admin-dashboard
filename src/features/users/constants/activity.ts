import type { UserActivityRecord } from '../types/activity';

export const DEMO_ACTIVITY_DATE = '2026-11-12';
export const ACTIVITY_PERIODS = ['daily', 'weekly', 'monthly'] as const;
export const ACTIVITY_SERVICES = ['Transfer', 'Giftcard', 'Airtime', 'Betting', 'Data', 'Electricity'];
export const SERVICE_COLORS = ['#3b82f6', '#f59e0b', '#16a34a', '#8b5cf6', '#a16207', '#f97316'];
export const DEMO_ACTIVITY_CONTEXT = {
  walletBalanceMinor: 34215000,
  lastActive: '12 Nov 2026, 14:32',
  streak: '4 of 5 days',
  device: 'iPhone 14 · iOS 18',
  kyc: 'verified',
  tier: 'Tier 2',
};

export const DEMO_ACTIVITY: UserActivityRecord[] = [
  { id: 'demo-1', occurredAt: '2026-11-12T14:32:00+01:00', description: 'Transfer to Yemi Balogun', amountMinor: 7500000, kind: 'spent', channel: 'Bank', service: 'Transfer', status: 'success' },
  { id: 'demo-2', occurredAt: '2026-11-12T13:05:00+01:00', description: 'From Chinyere Okoro', amountMinor: 10000000, kind: 'received', channel: 'Usertag', service: 'Transfer', status: 'success' },
  { id: 'demo-3', occurredAt: '2026-11-12T12:41:00+01:00', description: 'Ikeja Electric prepaid token', amountMinor: 1000000, kind: 'spent', channel: 'Wallet', service: 'Electricity', status: 'success' },
  { id: 'demo-4', occurredAt: '2026-11-12T12:38:00+01:00', description: 'Logged in', amountMinor: null, kind: 'session', channel: 'iOS app', service: 'Login', status: 'success' },
  { id: 'demo-5', occurredAt: '2026-11-12T11:10:00+01:00', description: 'MTN airtime', amountMinor: 200000, kind: 'spent', channel: 'Wallet', service: 'Airtime', status: 'success' },
  { id: 'demo-6', occurredAt: '2026-11-12T11:08:00+01:00', description: 'MTN airtime', amountMinor: 200000, kind: 'spent', channel: 'Wallet', service: 'Airtime', status: 'failed' },
  { id: 'demo-7', occurredAt: '2026-11-12T10:22:00+01:00', description: 'Streak check-in, day 4 of 5', amountMinor: null, kind: 'event', channel: 'iOS app', service: 'Rewards', status: 'success' },
  { id: 'demo-8', occurredAt: '2026-11-12T09:47:00+01:00', description: 'MTN data bundle, 1GB', amountMinor: 50000, kind: 'spent', channel: 'Wallet', service: 'Data', status: 'success' },
  { id: 'demo-9', occurredAt: '2026-11-12T09:15:00+01:00', description: 'From Ifeoma Nwosu', amountMinor: 2000000, kind: 'received', channel: 'Bank', service: 'Transfer', status: 'success' },
  { id: 'demo-10', occurredAt: '2026-11-12T09:02:00+01:00', description: 'Logged in', amountMinor: null, kind: 'session', channel: 'iOS app', service: 'Login', status: 'success' },
  { id: 'demo-11', occurredAt: '2026-11-12T07:30:00+01:00', description: 'Logged in', amountMinor: null, kind: 'session', channel: 'Android app', service: 'Login', status: 'success' },
  { id: 'demo-12', occurredAt: '2026-11-11T19:20:00+01:00', description: 'Amazon gift card', amountMinor: 2500000, kind: 'spent', channel: 'Wallet', service: 'Giftcard', status: 'success' },
  { id: 'demo-13', occurredAt: '2026-11-11T16:02:00+01:00', description: 'Transfer to Ado Okonkwo', amountMinor: 3000000, kind: 'spent', channel: 'Bank', service: 'Transfer', status: 'success' },
  { id: 'demo-14', occurredAt: '2026-11-11T10:15:00+01:00', description: 'From Jumoke Eze', amountMinor: 1500000, kind: 'received', channel: 'Usertag', service: 'Transfer', status: 'success' },
  { id: 'demo-15', occurredAt: '2026-11-10T18:44:00+01:00', description: 'Ikeja Electric token', amountMinor: 2000000, kind: 'spent', channel: 'Wallet', service: 'Electricity', status: 'success' },
  { id: 'demo-16', occurredAt: '2026-11-10T08:30:00+01:00', description: 'Streak check-in, day 2 of 5', amountMinor: null, kind: 'event', channel: 'iOS app', service: 'Rewards', status: 'success' },
  { id: 'demo-17', occurredAt: '2026-11-09T09:00:00+01:00', description: 'Salary from Bluechip Ltd', amountMinor: 25000000, kind: 'received', channel: 'Bank', service: 'Transfer', status: 'success' },
  { id: 'demo-18', occurredAt: '2026-11-09T07:45:00+01:00', description: 'Logged in', amountMinor: null, kind: 'session', channel: 'Android app', service: 'Login', status: 'success' },
];
