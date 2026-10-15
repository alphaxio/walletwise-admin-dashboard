'use client';

import { Button } from '@/components/ui/button';
import { useAccrualExport } from '../../hooks/useAccrualExport';
import type { Field, ListFilters } from '../../types/index';

export default function AccrualExportActions({filters, fields, visible = true}: {filters:ListFilters;fields:Field[];visible?:boolean}) {
  const {exporting,error,exportReport} = useAccrualExport(filters,fields);
  return <div className="space-y-2">
    {visible && <div className="flex gap-3">
      <Button disabled={exporting} onClick={() => exportReport('csv')}>Export CSV</Button>
      <Button disabled={exporting} onClick={() => exportReport('xlsx')}>Export Excel</Button>
    </div>}
    {error && <p role="alert">{error}</p>}
  </div>;
}
