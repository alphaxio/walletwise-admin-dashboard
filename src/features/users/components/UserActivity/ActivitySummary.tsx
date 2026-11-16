import { ArrowDownLeft, ArrowUpRight, ArrowLeftRight, LogIn } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import StatusBubble from '@/components/atoms/StatusBubble/StatusBubble';
import { DEMO_ACTIVITY_CONTEXT } from '../../constants/activity';
import { formatActivityMoney } from '../../helpers/activity';
import type { UserActivityState } from '../../hooks/useUserActivity';

export default function ActivitySummary({ summary, comparison }: { summary: UserActivityState['summary']; comparison: UserActivityState['comparison'] }) {
  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="flex flex-wrap items-center justify-between gap-5 py-5">
          <div>
            <p className="text-xs text-muted-foreground">Demo wallet balance</p>
            <p className="font-semibold">{formatActivityMoney(DEMO_ACTIVITY_CONTEXT.walletBalanceMinor)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Last active · demo</p>
            <p className="text-sm">{DEMO_ACTIVITY_CONTEXT.lastActive}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Check-in streak · demo</p>
            <p className="text-sm">{DEMO_ACTIVITY_CONTEXT.streak}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Device · demo</p>
            <p className="text-sm">{DEMO_ACTIVITY_CONTEXT.device}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <StatusBubble status={DEMO_ACTIVITY_CONTEXT.kyc} />
            <span className="text-xs text-muted-foreground">{DEMO_ACTIVITY_CONTEXT.tier} · demo</span>
          </div>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardContent className="space-y-3 py-5">
            <p className="flex items-center justify-between text-sm text-muted-foreground">
              Received <ArrowDownLeft className="size-4" />
            </p>
            <p className="break-words text-2xl font-semibold">{formatActivityMoney(summary.received)}</p>
            <p className="text-xs text-muted-foreground">Successful credits</p>
            <p className="text-xs text-muted-foreground">{comparison.received}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-3 py-5">
            <p className="flex items-center justify-between text-sm text-muted-foreground">
              Spent <ArrowUpRight className="size-4" />
            </p>
            <p className="break-words text-2xl font-semibold">{formatActivityMoney(summary.spent)}</p>
            <p className="text-xs text-muted-foreground">Successful debits</p>
            <p className="text-xs text-muted-foreground">{comparison.spent}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-3 py-5">
            <p className="flex items-center justify-between text-sm text-muted-foreground">
              Transactions <ArrowLeftRight className="size-4" />
            </p>
            <p className="text-2xl font-semibold">{summary.transactions}</p>
            <p className="text-xs text-muted-foreground">{summary.failed} failed · includes all statuses</p>
            <p className="text-xs text-muted-foreground">{comparison.transactions}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-3 py-5">
            <p className="flex items-center justify-between text-sm text-muted-foreground">
              Sessions <LogIn className="size-4" />
            </p>
            <p className="text-2xl font-semibold">{summary.sessions}</p>
            <p className="text-xs text-muted-foreground">Successful sign-ins</p>
            <p className="text-xs text-muted-foreground">{comparison.sessions}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
