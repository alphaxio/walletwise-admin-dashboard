import type { ReactNode } from 'react';
export default function FinancialDetailSection({ title, children }: { title: string; children: ReactNode }) {
  return <section className="space-y-3"><h3 className="font-semibold">{title}</h3>{children}</section>;
}
