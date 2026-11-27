"use client";

import { ShieldAlert } from "lucide-react";
import Link from "next/link";

import { useKillSwitchStatus } from "@/lib/hooks/useKillSwitch";

/** Red banner on every dashboard page while the emergency lock is on. */
const KillSwitchBanner = () => {
  const { data } = useKillSwitchStatus();
  if (!data?.locked) return null;

  const title = data.unknown
    ? "Emergency lock status could not be confirmed. Money actions are paused."
    : data.level === 2
      ? "EMERGENCY LOCK ON: full shutdown. The app is in maintenance."
      : "EMERGENCY LOCK ON: money is frozen. Changes in this dashboard are paused.";

  return (
    <div role="alert" className="mb-6 flex items-start gap-3 rounded-md border border-red-300 bg-red-50 p-4 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200">
      <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0" />
      <div className="text-sm">
        <p className="font-semibold">{title}</p>
        {(data.reason || data.since) && (
          <p className="mt-1">
            {data.reason ? `Reason: ${data.reason}. ` : ""}
            {data.by ? `By ${data.by}. ` : ""}
            {data.since ? `Since ${new Date(data.since).toLocaleString()}.` : ""}
          </p>
        )}
        <p className="mt-1">
          Only the named people can switch it back on, from AWS.{" "}
          <Link href="/security" className="underline">Emergency lock details</Link>
        </p>
      </div>
    </div>
  );
};

export default KillSwitchBanner;
