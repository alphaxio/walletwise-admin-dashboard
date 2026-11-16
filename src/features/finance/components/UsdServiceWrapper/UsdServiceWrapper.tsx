"use client";
import Button from "@/components/atoms/Button/Button";
import ServiceLayout from "@/components/templates/ServiceLayout/ServiceLayout";
import FinancialList from "../FinancialList/FinancialList";
import RateSettings from "../RateSettings/RateSettings";
export default function UsdServiceWrapper({
  section = "transactions",
  userId = "",
}: {
  section?: "transactions" | "settings";
  userId?: string;
}) {
  return (
    <ServiceLayout
      title="USD Dollar Accounts"
      defaultTab={section}
      onClick={() => undefined}
      tabs={[
        {
          value: "transactions",
          label: "Transactions & settlement",
          content: (
            <FinancialList resource="usd/transactions" userId={userId} />
          ),
        },
        {
          value: "settings",
          label: "Rates & fees",
          content: <RateSettings type="usd" />,
        },
        {
          value: "kyc",
          label: "USD KYC",
          content: (
            <Button href="/manage-usd-kyc" width="w-fit">
              Open USD onboarding review
            </Button>
          ),
        },
      ]}
    />
  );
}
