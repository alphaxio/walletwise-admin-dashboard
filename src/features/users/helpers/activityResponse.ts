import type { ActivityPeriod, ActivityResponse, ActivitySummaryData, UserActivityRecord } from '../types/activity';
import { SERVICE_COLORS } from '../constants/activity';
import { activityContextResponse } from './activityContextResponse';
import { ActivityResponseError, calendarDate, count, integer, number, object, optionalText, text, timestamp } from './activityValidation';
export { ActivityResponseError } from './activityValidation';

function summaryData(value: unknown): ActivitySummaryData {
  const summary = object(value);
  return { received: integer(summary.receivedMinor), spent: integer(summary.spentMinor),
    transactions: count(summary.transactions), failed: count(summary.failed), pending: count(summary.pending),
    sessions: summary.sessions === null ? null : count(summary.sessions) };
}
function recordData(value: unknown): UserActivityRecord {
  const row = object(value);
  const kind = text(row.kind), status = text(row.status).toLowerCase();
  if (!['received', 'spent', 'session', 'event'].includes(kind) || !['success', 'failed', 'pending', 'reversed'].includes(status)) throw new ActivityResponseError();
  return { id: text(row.id), occurredAt: timestamp(row.occurredAt), description: text(row.description), amountMinor: row.amountMinor === null ? null : integer(row.amountMinor), kind: kind as UserActivityRecord['kind'], channel: text(row.channel), service: text(row.service), status: status as UserActivityRecord['status'] };
}
function difference(current: number | null, previous: number | null | undefined, percentage: boolean) {
  if (current === null || previous == null || percentage && previous === 0) return null;
  return percentage ? (current - previous) / previous * 100 : current - previous;
}

export function normalizeActivityResponse(value: unknown, period: ActivityPeriod): ActivityResponse {
  const envelope = object(value);
  if (envelope.success === false) throw new Error(optionalText(envelope.message) ?? 'Unable to load user activity.');
  const body = object(envelope.data);
  if (body.period !== period || !Array.isArray(body.buckets) || !Array.isArray(body.services) || !Array.isArray(body.records) || typeof body.recordsTruncated !== 'boolean') throw new ActivityResponseError();
  const range = object(body.range);
  const start = calendarDate(range.start), end = calendarDate(range.end);
  if (start >= end) throw new ActivityResponseError();
  const summary = summaryData(body.summary);
  const previous = body.previousSummary == null ? null : summaryData(body.previousSummary);
  return {
    period, date: calendarDate(body.date), range: { start, end }, summary,
    comparison: { received: difference(summary.received, previous?.received, true), spent: difference(summary.spent, previous?.spent, true), transactions: difference(summary.transactions, previous?.transactions, false), sessions: difference(summary.sessions, previous?.sessions, false) },
    context: activityContextResponse(body.context),
    buckets: body.buckets.map(value => { const bucket = object(value); return { label: text(bucket.label), received: integer(bucket.receivedMinor) / 100, spent: integer(bucket.spentMinor) / 100 }; }),
    services: body.services.map((value, index) => { const service = object(value); return { service: text(service.service), amountMinor: integer(service.amountMinor), color: SERVICE_COLORS[index % SERVICE_COLORS.length], sharePercent: Math.min(100, Math.max(0, number(service.sharePercent))) }; }),
    records: body.records.map(recordData), recordsTruncated: body.recordsTruncated,
  };
}
