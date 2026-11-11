import DashboardLayout from "@/components/templates/DashboardLayout/DashboardLayout";
import PageTitle from "@/components/atoms/PageTitle/PageTitle";
import { ProtectedPage } from "@/components/ProtectedPage";
import SettlementSweep from "@/features/finance/components/SettlementSweep/SettlementSweep";

export default function SettlementSweepPage() {
  return (
    <ProtectedPage requiredPermissions={["wallet.sweep"]}>
      <DashboardLayout title="Settlement sweep">
        <div className="space-y-6">
          <PageTitle
            title="Settlement sweep"
            description="Compare every personal account with its app wallet, and move the extra to the settlement account."
          />
          <SettlementSweep />
        </div>
      </DashboardLayout>
    </ProtectedPage>
  );
}
