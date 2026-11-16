"use client";

import { Flag, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUserFlagControls } from '@/features/users/hooks/useUserFlagControls';
import FlagUserModal from '../modals/FlagUserModal/FlagUserModal';

export default function FlagUserAlert({ userId, email, isSuspicious, flagReason }: {
  email: string;
  userId: string;
  isSuspicious: boolean;
  flagReason?: string;
}) {
  const controls = useUserFlagControls(userId, email, isSuspicious);

  return <>
    <div className={`rounded-xl border p-4 ${isSuspicious ? 'border-amber-300 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/20' : 'border-border bg-background'}`}>
      <div className="flex items-start gap-3">
        <div className={`rounded-lg p-2 ${isSuspicious ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' : 'bg-muted text-muted-foreground'}`}>
          {isSuspicious ? <Flag className="size-4" /> : <ShieldCheck className="size-4" />}
        </div>
        <div className="min-w-0 space-y-1">
          <p className="text-sm font-semibold">{isSuspicious ? 'Flagged for review' : 'No user flag'}</p>
          <p className="break-words text-xs leading-relaxed text-muted-foreground">
            {isSuspicious ? flagReason || 'This account has been flagged for administrative review.' : 'Flag this account if it needs further review.'}
          </p>
        </div>
      </div>
      <Button variant="outline" size="sm" className="mt-4 w-full" onClick={controls.openFlagDialog} disabled={controls.isUpdating}>
        <Flag className="size-4" /> {isSuspicious ? 'Remove user flag' : 'Flag user'}
      </Button>
    </div>
    <FlagUserModal open={controls.isOpen} setOpen={controls.setIsOpen} setReason={controls.setReason} reason={controls.reason} handleSubmit={controls.submitFlag} isFlagged={isSuspicious} isUpdating={controls.isUpdating} />
  </>;
}
