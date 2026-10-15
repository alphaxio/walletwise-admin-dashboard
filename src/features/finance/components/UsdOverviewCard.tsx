'use client';

import { useQuery } from '@tanstack/react-query';
import { DollarSign } from 'lucide-react';
import StatisticCard from '@/components/molecules/StatisticCard/StatisticCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { fetchList } from '../api';

export default function UsdOverviewCard({ metric = 'revenue' }: { metric?: 'revenue' | 'inflow' }) {
  const query = useQuery({
    queryKey: ['finance','usd/transactions','overview-summary'],
    queryFn: ({signal}) => fetchList('usd/transactions', {page:1,limit:1,search:'',status:'',rail:'',planType:'',userId:''}, signal),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
  if (query.isPending) return <Skeleton className="h-40 rounded-xl" aria-label="Loading USD total" />;
  const raw = query.data?.metrics[metric === 'inflow' ? 'totalVolumeIn' : 'totalFees'];
  const value = raw == null || raw === '' ? null : Number(raw);
  return <div className="space-y-2">
    <StatisticCard title={metric === 'inflow' ? 'Total USD inflow' : 'Total USD revenue'} value={value} currency="US$" icon={<DollarSign />} color="blue" />
    {query.isError && <Button variant="outline" onClick={() => query.refetch()}>Retry USD total</Button>}
  </div>;
}
