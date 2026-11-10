import DashboardLayout from "@/components/templates/DashboardLayout/DashboardLayout";
import PageTitle from "@/components/atoms/PageTitle/PageTitle";
import { ProtectedPage } from "@/components/ProtectedPage";
import WalletAdjustments from "@/features/finance/components/WalletAdjustments/WalletAdjustments";

export default function WalletAdjustmentsPage() {
  return (
    <ProtectedPage requiredPermissions={["wallet.adjust"]}>
      <DashboardLayout title="Wallet adjustments">
        <div className="space-y-6">
          <PageTitle
            title="Wallet adjustments"
            description="Compare a user's app wallet with SafeHaven, check a session ID, and credit, debit or refund manually."
          />
          <WalletAdjustments />
        </div>
      </DashboardLayout>
    </ProtectedPage>
  );
}
