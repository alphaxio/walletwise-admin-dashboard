import type { ActivityPeriod } from '../types/activity';
import { activityRange } from '../helpers/activity';

// Matches the supplied backend response; identifying values are synthetic.
export function emptyActivityPayload(period: ActivityPeriod = 'daily', date = '2026-11-19') {
  return { success: true, message: 'User activity retrieved successfully', data: {
    userId: 'test-user', email: 'test@example.com', period, date,
    range: { ...activityRange(date, period), timezone: 'Africa/Lagos' },
    previousRange: { start: '2026-11-18', end: '2026-11-19' },
    context: {
      walletBalanceMinor: 13641444, lastActive: '2026-10-18T11:17:12+01:00',
      device: { name: 'iPhone13,3', os: '26.5.2', type: 'IOS' },
      kyc: { tier: '3', bvnStatus: 'verified', ninStatus: 'verified', identityStatus: 'verified' },
      streak: { checkInsInPeriod: 0, daysInPeriodSoFar: 1, currentStreak: 0, lastCheckIn: '2026-03-08' },
    },
    summary: { receivedMinor: 0, spentMinor: 0, transactions: 0, failed: 0, pending: 0, sessions: null as number | null },
    previousSummary: { receivedMinor: 0, spentMinor: 0, transactions: 0, failed: 0, pending: 0, sessions: null as number | null },
    buckets: Array.from({ length: 24 }, (_, hour) => ({ key: String(hour).padStart(2, '0'), label: `${String(hour).padStart(2, '0')}:00`, receivedMinor: 0, spentMinor: 0 })),
    services: ['Transfer', 'Giftcard', 'Airtime', 'Betting', 'Data', 'Electricity', 'Other'].map(service => ({ service, amountMinor: 0, sharePercent: 0 })),
    records: [] as { id: string; occurredAt: string; description: string; amountMinor: number | null; kind: string; channel: string; service: string; status: string }[],
    recordsTruncated: false,
  } };
}
export function activityPayload(period: ActivityPeriod = 'daily') {
  const payload = emptyActivityPayload(period);
  payload.data.context.walletBalanceMinor = 0;
  payload.data.summary = { receivedMinor: 12000000, spentMinor: 8750000, transactions: 7, failed: 1, pending: 0, sessions: 3 };
  payload.data.previousSummary = { receivedMinor: 10000000, spentMinor: 8000000, transactions: 5, failed: 0, pending: 0, sessions: 2 };
  payload.data.buckets[9].receivedMinor = 12000000;
  payload.data.buckets[14].spentMinor = 8750000;
  payload.data.services[0].amountMinor = 8750000;
  payload.data.services[0].sharePercent = 100;
  payload.data.records = [
    { id: 'payment-1', occurredAt: '2026-11-19T13:32:00Z', description: 'Transfer to Yemi Balogun', amountMinor: 7500000, kind: 'spent', channel: 'bank', service: 'transfer', status: 'success' },
    { id: 'payment-2', occurredAt: '2026-11-19T10:08:00Z', description: 'MTN airtime', amountMinor: 200000, kind: 'spent', channel: 'wallet', service: 'airtime', status: 'failed' },
    { id: 'session-1', occurredAt: '2026-11-19T08:02:00Z', description: 'Logged in', amountMinor: null, kind: 'session', channel: 'ios_app', service: 'login', status: 'success' },
  ];
  payload.data.recordsTruncated = true;
  return payload;
}
