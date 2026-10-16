import DashboardLayout from '@/components/templates/DashboardLayout/DashboardLayout';
import PageTitle from '@/components/atoms/PageTitle/PageTitle';
import FinancialList from '@/features/finance/components/FinancialList/FinancialList';
export default function Page() { return <DashboardLayout title="USD KYC"><div className="space-y-6"><PageTitle title="USD onboarding review" description="Inspect documents, review source of funds, and synchronize Miden verification."/><FinancialList resource="usd/kyc"/></div></DashboardLayout>; }
