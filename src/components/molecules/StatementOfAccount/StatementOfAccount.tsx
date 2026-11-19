"use client";

import { CalendarDays, CheckCircle2, Download, FileText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useGetUserAccountStatement } from '@/features/users/hooks/useGetUserAccountStatement';

interface StatementOfAccountProps {
  userId: string;
  userName?: string;
}

export function StatementOfAccount({ userId, userName }: StatementOfAccountProps) {
  const statement = useGetUserAccountStatement(userId);

  return (
    <section aria-label="Download account statement" className="min-w-0 overflow-hidden rounded-2xl border bg-card text-card-foreground dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 shadow-sm">
      <div className="flex flex-col gap-4 border-b bg-muted/20 dark:border-gray-700 dark:bg-gray-900/50 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div className="flex items-start gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-200">
            <FileText className="size-5" />
          </div>
          <div className="min-w-0">
            <h3 className="text-base font-semibold">Account statement</h3>
            <p className="mt-1 text-sm text-muted-foreground dark:text-gray-400">Download {userName ? `${userName}’s` : 'this user’s'} transaction statement for a selected period.</p>
          </div>
        </div>
        <span className="w-fit shrink-0 rounded-md border bg-background dark:border-gray-700 dark:bg-gray-900 px-2.5 py-1 text-xs font-medium text-muted-foreground dark:text-gray-400">PDF document</span>
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end">
          <div className="min-w-0 flex-1 space-y-2">
            <p id="statement-period-label" className="text-sm font-medium">Statement period</p>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" aria-labelledby="statement-period-label statement-period-value" disabled={statement.isPending} className="h-auto min-h-11 w-full justify-start gap-3 whitespace-normal py-3 text-left font-normal dark:bg-gray-900 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700">
                  <CalendarDays className="size-4 shrink-0 text-muted-foreground dark:text-gray-400" />
                  <span id="statement-period-value">{statement.rangeLabel}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="max-h-[min(32rem,80dvh)] w-auto max-w-[calc(100vw-2rem)] overflow-auto p-0 dark:bg-gray-800 dark:border-gray-700" align="start">
                <Calendar mode="range" defaultMonth={statement.dateRange?.from} selected={statement.dateRange} onSelect={statement.changeDateRange} className="dark:bg-gray-800" numberOfMonths={1} disabled={{ after: new Date() }} />
              </PopoverContent>
            </Popover>
          </div>
          <Button onClick={statement.handleDownload} disabled={statement.isPending || !statement.hasCompleteRange} className="min-h-11 w-full gap-2 xl:w-auto xl:px-6 dark:bg-purple-800 dark:text-white dark:hover:bg-purple-700">
            {statement.isPending ? <Loader2 className="size-4 animate-spin" /> : <Download className="size-4" />}
            {statement.isPending ? 'Generating statement…' : 'Download statement'}
          </Button>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 text-xs text-muted-foreground dark:text-gray-400">Quick select</span>
          <Button variant="outline" size="sm" className="dark:bg-gray-900 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700" disabled={statement.isPending} onClick={statement.selectWeek}>Last 7 days</Button>
          <Button variant="outline" size="sm" className="dark:bg-gray-900 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700" disabled={statement.isPending} onClick={statement.selectMonth}>Last 30 days</Button>
          <Button variant="outline" size="sm" className="dark:bg-gray-900 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700" disabled={statement.isPending} onClick={statement.selectCurrentMonth}>This month</Button>
        </div>
        <div role="status" className="text-xs text-muted-foreground dark:text-gray-400">
          {statement.isSuccess ? <p className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400"><CheckCircle2 className="size-4" />Your statement has been downloaded.</p> : statement.isPending ? 'Preparing your PDF. Your download will start automatically.' : 'Choose both dates to download a PDF. Future dates are unavailable.'}
        </div>
      </div>
    </section>
  );
}
