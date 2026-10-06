import Link from "next/link";
import type { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatusBubble from "@/components/atoms/StatusBubble/StatusBubble";
import TypeBadge from "@/components/atoms/TypeBadge/TypeBadge";
import type { SavingsTransactionDetails } from "../../types/savings";

const text = (value: string | number | null | undefined) =>
  value === null || value === undefined || value === "" ? "N/A" : value;
const label = (value?: string | null) => value?.replace(/_/g, " ") || "N/A";
const yesNo = (value?: boolean | null) => value === true ? "Yes" : value === false ? "No" : "N/A";

function numeric(value: string | number | null | undefined) {
  if (value == null || (typeof value === "string" && !value.trim())) return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function money(value: string | number | null | undefined) {
  const number = numeric(value);
  return number === null ? "N/A" : new Intl.NumberFormat("en-NG", {
    style: "currency", currency: "NGN", minimumFractionDigits: 2, maximumFractionDigits: 2,
  }).format(number);
}

function date(value?: string | null) {
  if (!value || Number.isNaN(new Date(value).getTime())) return "N/A";
  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium", timeStyle: "short", timeZone: "Africa/Lagos",
  }).format(new Date(value));
}

function DetailsCard({ title, fields }: { title: string; fields: [string, ReactNode][] }) {
  return (
    <Card className="min-w-0 border-border/50 dark:bg-gray-800">
      <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
      <CardContent>
        <dl className="grid gap-5 sm:grid-cols-2">
          {fields.map(([name, value]) => (
            <div key={name} className="min-w-0 space-y-1">
              <dt className="text-sm text-muted-foreground">{name}</dt>
              <dd className="break-words font-medium">{value}</dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  );
}

export default function SavingsDetails({ data }: { data: SavingsTransactionDetails }) {
  const meta = data.plan_meta_data;
  const rate = numeric(data.interest_rate);
  const name = [data.first_name, data.last_name].filter(Boolean).join(" ");

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        {([
          ["Transaction amount", data.amount],
          ["Balance before transaction", data.balance_before],
          ["Balance after transaction", data.balance_after],
        ] as const).map(([title, value]) => (
          <Card key={title} className="min-w-0 dark:bg-gray-800">
            <CardHeader><CardTitle className="text-sm text-muted-foreground">{title}</CardTitle></CardHeader>
            <CardContent className="break-words text-2xl font-bold">{money(value)}</CardContent>
          </Card>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">All dates and times are shown in West Africa Time (UTC+1).</p>
      <div className="grid gap-6 xl:grid-cols-2">
        <DetailsCard title="Transaction details" fields={[
          ["Transaction ID", text(data.id)],
          ["Reference", <span key="reference" className="font-mono text-sm">{text(data.reference)}</span>],
          ["Transaction type", <TypeBadge key="type" type={data.transaction_type} />],
          ["Transaction category", <span key="category" className="capitalize">{label(data.transaction_category)}</span>],
          ["Transaction date", date(data.transaction_created_at)],
          ["Savings account ID", text(data.savings_account_id)],
        ]} />
        <DetailsCard title="Savings plan" fields={[
          ["Plan name", text(meta?.name)],
          ["Plan type", <span key="plan" className="capitalize">{label(data.plan_type)}</span>],
          ["Plan status", <StatusBubble key="status" status={data.plan_status} />],
          ["Current plan balance", money(data.current_plan_balance)],
          ["Plan created", date(data.plan_created_at)],
          ["Duration", meta?.durationDays == null ? "N/A" : `${meta.durationDays} days`],
          ["Maturity date", date(meta?.maturityDate)],
        ]} />
        <DetailsCard title="Interest details" fields={[
          ["Interest rate", rate === null ? "N/A" : `${rate}%`],
          ["Interest amount", money(meta?.interestAmount)],
          ["Interest payout mode", <span key="payout" className="capitalize">{label(meta?.interestPayoutMode)}</span>],
          ["Upfront interest paid", yesNo(meta?.upfrontInterestPaid)],
        ]} />
        <DetailsCard title="Customer information" fields={[
          ["Name", <span key="name" className="capitalize">{name || "N/A"}</span>],
          ["Email", text(data.userID)],
          ["Phone number", text(data.phone_number)],
          ["User tag", data.user_tag ? `@${data.user_tag}` : "N/A"],
          ["User ID", data.user_uuid ? <Link key="user" className="text-purple-600 underline dark:text-purple-400" href={`/manage-user/info/${encodeURIComponent(data.user_uuid)}`}>{data.user_uuid}</Link> : "N/A"],
          ["User flagged", yesNo(data.user_flagged)],
        ]} />
      </div>
    </div>
  );
}
