import DashboardLayout from "@/components/templates/DashboardLayout/DashboardLayout";
import EmergencyLockCard from "@/components/EmergencyLockCard";
import ChangePasswordWrapper from "@/features/auth/components/ChangePasswordWrapper/ChangePasswordWrapper";

const ChangePasswordPage = () => {
  return (
    <DashboardLayout title="Security">
      <EmergencyLockCard />
      <ChangePasswordWrapper />
    </DashboardLayout>
  );
};

export default ChangePasswordPage;
