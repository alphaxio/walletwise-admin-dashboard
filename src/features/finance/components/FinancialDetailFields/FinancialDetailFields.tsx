import type { ReactNode } from 'react';
import StatusBubble from '@/components/atoms/StatusBubble/StatusBubble';
import TableDate from '@/components/atoms/TableDate/TableDate';
import { read,display,money } from '../../helpers/records';
import type { DetailField,RecordData } from '../../types/index';
export default function FinancialDetailFields({ data, fields }: { data: RecordData; fields: DetailField[] }) {
  return <dl className="grid sm:grid-cols-2 gap-4">{fields.map(field => {
    const value = read(data, field.path);
    let content: ReactNode = display(value);
    if (field.format === 'status') content = <StatusBubble status={typeof value === 'string' ? value : undefined} />;
    if (field.format === 'date') content = value ? <TableDate date={String(value)} showWithTime={field.path !== 'user.dob'} /> : '—';
    if (field.format === 'usd') content = money(value, 'USD');
    return <div key={field.path} className="rounded border p-3"><dt className="text-sm text-muted-foreground">{field.label}</dt><dd className="break-words [overflow-wrap:anywhere]">{content}</dd></div>;
  })}</dl>;
}
