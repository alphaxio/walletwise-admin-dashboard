import UsdServiceWrapper from '@/features/finance/components/UsdServiceWrapper';
export default async function Page({ searchParams }: {
    searchParams: Promise<{
        userId?: string;
    }>;
}) { const { userId } = await searchParams; return <UsdServiceWrapper section="transactions" userId={userId ?? ''}/>; }
