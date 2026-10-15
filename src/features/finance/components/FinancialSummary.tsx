import { metrics } from '../constants/lists';
import { display, money } from '../helpers/records';
import type { RecordData, Resource } from '../types';

export default function FinancialSummary({ resource, values, status, onStatusChange }: {
  resource: Resource;
  values?: RecordData;
  status: string;
  onStatusChange: (status: string) => void;
}) {
  const fields = metrics[resource];
  if (!fields) return null;

  return <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
    {fields.map(field => {
      const content = <><p className="text-sm text-muted-foreground">{field.label}</p><p className="text-2xl font-semibold">{field.currency ? money(values?.[field.key],field.currency) : display(values?.[field.key])}</p></>;
      if (field.filterStatus === undefined) return <div key={field.key} className="rounded-xl border p-5">{content}</div>;
      const active = status === field.filterStatus;
      return <button key={field.key} type="button" aria-pressed={active} onClick={() => onStatusChange(field.filterStatus!)} className={`rounded-xl border p-5 text-left cursor-pointer transition duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 ${active ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 ring-1 ring-purple-500' : ''}`}>{content}</button>;
    })}
  </div>;
}
