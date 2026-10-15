import { Button } from '@/components/ui/button';
import TableLoader from '@/components/atoms/skeleton/TableLoader';
export default function RequestState({ pending, error, retry }: {
    pending: boolean;
    error: boolean;
    retry: () => void;
}) { if (pending)
    return <div role="status" aria-label="Loading financial data" className="space-y-3"><TableLoader /></div>; if (error)
    return <div role="alert" className="rounded border p-6 space-y-3"><p>Unable to load financial data. Check the API connection and your permissions.</p><Button onClick={retry}>Retry</Button></div>; return null; }
