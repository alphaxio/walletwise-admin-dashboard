import { Bar, BarChart, CartesianGrid, Legend, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { formatActivityMoney, formatAxisMoney, formatTooltipMoney } from '../../helpers/activity';
import type { UserActivityState } from '../../hooks/useUserActivity';

const chartConfig = {
  received: { label: 'Received', color: '#16a34a' },
  spent: { label: 'Spent', color: '#3b82f6' },
};

export default function ActivityCharts({ state }: { state: UserActivityState }) {
  return (
    <div className="grid min-w-0 grid-cols-1 gap-4 xl:grid-cols-2">
      <Card className="min-w-0 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100">
        <CardHeader>
          <CardTitle className="text-base">Activity by {state.period === 'daily' ? 'hour' : 'day'}</CardTitle>
        </CardHeader>
        <CardContent className="px-2 sm:px-5">
          <ChartContainer config={chartConfig} className="h-72 w-full">
            <BarChart data={state.buckets} accessibilityLayer margin={{ right: 8 }}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="label" tickLine={false} axisLine={false} minTickGap={24} />
              <YAxis tickFormatter={formatAxisMoney} tickLine={false} axisLine={false} width={65} />
              <ChartTooltip content={<ChartTooltipContent formatter={formatTooltipMoney} />} />
              <Legend />
              <Bar name="Received" dataKey="received" fill="var(--color-received)" radius={[3, 3, 0, 0]} />
              <Bar name="Spent" dataKey="spent" fill="var(--color-spent)" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
      <Card className="min-w-0 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100">
        <CardHeader><CardTitle className="text-base">Spent by service</CardTitle></CardHeader>
        <CardContent className="space-y-5">
          {state.services.map(service => (
            <div key={service.service} className="grid grid-cols-[5rem_minmax(0,1fr)] items-center gap-3 sm:grid-cols-[5rem_minmax(0,1fr)_7rem]">
              <span className="text-sm text-muted-foreground dark:text-gray-400">{service.service}</span>
              <div
                role="meter"
                aria-label={`${service.service} share of spend`}
                aria-valuenow={service.sharePercent}
                aria-valuemin={0}
                aria-valuemax={100}
                className="h-2 overflow-hidden rounded-full bg-muted dark:bg-gray-700"
              >
                <div className="h-full rounded-full" style={{ width: `${service.sharePercent}%`, backgroundColor: service.color }} />
              </div>
              <span className="col-span-2 text-right text-sm tabular-nums sm:col-span-1">{formatActivityMoney(service.amountMinor)}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
