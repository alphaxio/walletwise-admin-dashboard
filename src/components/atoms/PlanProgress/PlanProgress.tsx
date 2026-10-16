import { planProgress } from '@/features/finance/helpers/records';
export default function PlanProgress({ start, end }: {
    start: unknown;
    end: unknown;
}) {
    const progress = planProgress(start, end);
    if (!progress)
        return <span>—</span>;
    return <div><progress aria-label="Plan progress" max={100} value={progress.percent}/><p>{progress.days} days remaining</p></div>;
}
