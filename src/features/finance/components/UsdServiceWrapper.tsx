'use client';
import Link from 'next/link';
import ServiceLayout from '@/components/templates/ServiceLayout/ServiceLayout';
import FinancialList from './FinancialList';
import RateSettings from './RateSettings';
export default function UsdServiceWrapper({ section = 'transactions', userId = '' }: {
    section?: 'transactions' | 'settings';
    userId?: string;
}) {
    return <ServiceLayout title="USD Dollar Accounts" defaultTab={section} onClick={() => undefined} tabs={[
            { value: 'transactions', label: 'Transactions & settlement', content: <FinancialList resource="usd/transactions" userId={userId}/> },
            { value: 'settings', label: 'Rates & fees', content: <RateSettings type="usd"/> },
            { value: 'kyc', label: 'USD KYC', content: <Link className="underline" href="/manage-usd-kyc">Open USD onboarding review</Link> },
        ]}/>;
}
