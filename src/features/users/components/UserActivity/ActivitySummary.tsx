import { ArrowDownLeft, ArrowUpRight, ArrowLeftRight, LogIn } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { ActivitySummaryData } from '../../types/activity';
import { formatActivityMoney } from '../../helpers/activity';
import type { UserActivityState } from '../../hooks/useUserActivity';

export default function ActivitySummary({ summary, comparison }: { summary: ActivitySummaryData; comparison: UserActivityState['comparison'] }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100">
          <CardContent className="space-y-3 py-5">
            <p className="flex items-center justify-between text-sm text-muted-foreground dark:text-gray-400">
              Received <ArrowDownLeft className="size-4" />
            </p>
            <p className="break-words text-2xl font-semibold">{formatActivityMoney(summary.received)}</p>
            <p className="text-xs text-muted-foreground dark:text-gray-400">Successful credits</p>
            <p className="text-xs text-muted-foreground dark:text-gray-400">{comparison.received}</p>
          </CardContent>
        </Card>
        <Card className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100">
          <CardContent className="space-y-3 py-5">
            <p className="flex items-center justify-between text-sm text-muted-foreground dark:text-gray-400">
              Spent <ArrowUpRight className="size-4" />
            </p>
            <p className="break-words text-2xl font-semibold">{formatActivityMoney(summary.spent)}</p>
            <p className="text-xs text-muted-foreground dark:text-gray-400">Successful debits</p>
            <p className="text-xs text-muted-foreground dark:text-gray-400">{comparison.spent}</p>
          </CardContent>
        </Card>
        <Card className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100">
          <CardContent className="space-y-3 py-5">
            <p className="flex items-center justify-between text-sm text-muted-foreground dark:text-gray-400">
              Transactions <ArrowLeftRight className="size-4" />
            </p>
            <p className="text-2xl font-semibold">{summary.transactions}</p>
            <p className="text-xs text-muted-foreground dark:text-gray-400">{summary.failed} failed · {summary.pending} pending</p>
            <p className="text-xs text-muted-foreground dark:text-gray-400">{comparison.transactions}</p>
          </CardContent>
        </Card>
        <Card className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100">
          <CardContent className="space-y-3 py-5">
            <p className="flex items-center justify-between text-sm text-muted-foreground dark:text-gray-400">
              Sessions <LogIn className="size-4" />
            </p>
            <p className="text-2xl font-semibold">{summary.sessions ?? 'N/A'}</p>
            <p className="text-xs text-muted-foreground dark:text-gray-400">{summary.sessions === null ? 'Session count unavailable' : 'Successful sign-ins'}</p>
            <p className="text-xs text-muted-foreground dark:text-gray-400">{comparison.sessions}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
