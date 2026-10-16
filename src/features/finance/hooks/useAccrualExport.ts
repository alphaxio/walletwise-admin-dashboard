'use client';

import { useRef, useState } from 'react';
import type { Field, ListFilters } from '../types';

export function useAccrualExport(filters:ListFilters, fields:Field[]) {
  const [exporting,setExporting] = useState(false);
  const [error,setError] = useState('');
  const inFlight = useRef(false);
  async function exportReport(format:'csv'|'xlsx') {
    if (inFlight.current) return;
    inFlight.current = true;
    setExporting(true);
    setError('');
    try {
      const { exportAccruals } = await import('../helpers/exportAccruals');
      await exportAccruals(filters,fields,format);
    } catch {
      setError('Export failed. Please retry.');
    } finally {
      inFlight.current = false;
      setExporting(false);
    }
  }
  return {exporting,error,exportReport};
}
