import { Card, CardContent } from '@/components/ui/card';
import StatusBubble from '@/components/atoms/StatusBubble/StatusBubble';
import { formatActivityMoney, formatActivityTime } from '../../helpers/activity';
import type { ActivityContextData } from '../../types/activity';

export default function ActivityContext({ context }: { context: ActivityContextData | null | undefined }) {
  if (!context) return null;
  return <Card className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100">
    <CardContent className="flex flex-wrap items-center justify-between gap-5 py-5">
      <div><p className="text-xs text-muted-foreground dark:text-gray-400">Wallet balance</p><p className="font-semibold">{context.walletBalanceMinor === null ? '—' : formatActivityMoney(context.walletBalanceMinor)}</p></div>
      <div><p className="text-xs text-muted-foreground dark:text-gray-400">Last active</p><p className="text-sm">{context.lastActiveAt ? formatActivityTime(context.lastActiveAt) : '—'}</p></div>
      <div><p className="text-xs text-muted-foreground dark:text-gray-400">Check-in streak</p><p className="text-sm">{context.streak ?? '—'}</p>{context.checkInProgress && <p className="text-xs text-muted-foreground dark:text-gray-400">{context.checkInProgress}</p>}</div>
      <div><p className="text-xs text-muted-foreground dark:text-gray-400">Device</p><p className="text-sm">{context.device ?? '—'}</p></div>
      {(context.kyc || context.tier) && <div className="flex items-center gap-2">{context.kyc && <><span className="text-xs text-muted-foreground dark:text-gray-400">Identity</span><StatusBubble status={context.kyc} /></>}{context.tier && <span className="text-xs text-muted-foreground dark:text-gray-400">{context.tier}</span>}</div>}
    </CardContent>
  </Card>;
}
