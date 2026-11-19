import type { UserActivityRecord } from '../types/activity';

function csvCell(value: string | number) {
  const raw = typeof value === 'number' ? value.toFixed(2) : /^[\s]*[=+@-]/.test(value) ? `'${value}` : value;
  return `"${raw.replace(/"/g, '""')}"`;
}
export function activityCsv(records: UserActivityRecord[]) {
  const rows = [['Date and time', 'Activity', 'Amount (NGN)', 'Type', 'Channel', 'Service', 'Status'],
    ...records.map(row => [row.occurredAt, row.description, row.amountMinor === null ? '' : row.amountMinor / 100, row.kind, row.channel, row.service, row.status])];
  return rows.map(row => row.map(csvCell).join(',')).join('\r\n');
}
export function exportActivity(records: UserActivityRecord[], date: string) {
  const url = URL.createObjectURL(new Blob([activityCsv(records)], { type: 'text/csv;charset=utf-8;' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = `user-activity-${date}.csv`;
  document.body.appendChild(link);
  link.click(); link.remove();
  URL.revokeObjectURL(url);
}
