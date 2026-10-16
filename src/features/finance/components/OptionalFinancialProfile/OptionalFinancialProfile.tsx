import FinancialDetailSection from '../FinancialDetailSection/FinancialDetailSection';
import { display,object } from '../../helpers/records';

export default function OptionalFinancialProfile({ title, value }: { title: string; value: unknown }) {
  const entries = Object.entries(object(value));
  return <FinancialDetailSection title={title}>{entries.length ? <dl className="grid sm:grid-cols-2 gap-4">{entries.map(([key,item]) => <div key={key} className="rounded border p-3"><dt className="text-sm text-muted-foreground capitalize">{key.replace(/([a-z])([A-Z])/g,'$1 $2').replaceAll('_',' ')}</dt><dd className="break-words">{display(item)}</dd></div>)}</dl> : <p className="text-sm text-muted-foreground">{value == null ? 'Not provided' : display(value)}</p>}</FinancialDetailSection>;
}

