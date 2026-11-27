"use client";

import { ShieldAlert } from "lucide-react";
import { useState } from "react";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useKillSwitchStatus, useLockKillSwitch } from "@/lib/hooks/useKillSwitch";

const LEVELS = {
  1: {
    label: "Freeze money (Level 1)",
    description:
      "Stops every action that moves money: transfers, bills, cards, USD, savings, gift cards and admin money actions. Users can still log in and see their balance.",
  },
  2: {
    label: "Full shutdown (Level 2)",
    description:
      "Stops the whole app. Users see \"WalletWise is under maintenance\". Use this for a confirmed hack.",
  },
} as const;

/** Emergency lock button. Shown on the Security page to super admins. */
const EmergencyLockCard = () => {
  const { data, isLoading, isError } = useKillSwitchStatus();
  const [level, setLevel] = useState<1 | 2 | null>(null);
  const [reason, setReason] = useState("");
  const { mutate, isPending } = useLockKillSwitch(() => {
    setLevel(null);
    setReason("");
  });

  if (isLoading || isError || !data) return null;
  if (!data.canLock && !data.locked) return null;

  const currentLevel = data.level ?? 0;
  const canRaiseTo = (l: 1 | 2) => data.canLock && data.configured && currentLevel < l;

  return (
    <section className="mb-10 rounded-md border border-red-200 p-6 dark:border-red-900">
      <div className="mb-3 flex items-center gap-2">
        <ShieldAlert className="h-5 w-5 text-red-600" />
        <h2 className="text-lg font-semibold">Emergency lock</h2>
      </div>

      <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">
        {data.locked
          ? `The emergency lock is ON (${data.level === 2 ? "full shutdown" : "money frozen"}). Only the named people can switch it back on, from the AWS console.`
          : "Use this only if you think WalletWise is being hacked or money is leaving wrongly. You cannot switch it back on from here: only the named people can, from AWS. Everyone on the emergency list is emailed at once."}
      </p>

      {!data.configured && data.canLock && (
        <p className="mb-4 text-sm text-amber-700">The emergency lock is not set up on the server yet.</p>
      )}

      <div className="flex flex-wrap gap-3">
        {([1, 2] as const).map((l) =>
          canRaiseTo(l) ? (
            <Button key={l} variant="destructive" onClick={() => setLevel(l)}>
              {LEVELS[l].label}
            </Button>
          ) : null,
        )}
      </div>

      <AlertDialog open={level !== null} onOpenChange={(open) => !open && !isPending && setLevel(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{level ? LEVELS[level].label : ""}</AlertDialogTitle>
            <AlertDialogDescription>{level ? LEVELS[level].description : ""}</AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-2">
            <label htmlFor="kill-switch-reason" className="text-sm font-medium">
              Reason (required)
            </label>
            <Textarea
              id="kill-switch-reason"
              value={reason}
              maxLength={200}
              placeholder="What did you see?"
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <Button
              variant="destructive"
              disabled={isPending || reason.trim().length < 5 || !level}
              onClick={() => level && mutate({ level, reason: reason.trim() })}
            >
              {isPending ? "Locking..." : "Turn on emergency lock"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
};

export default EmergencyLockCard;
