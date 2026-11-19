import { ArrowUpRight, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import type { UserType } from '../../types';
import { getProfileFields, getProfileStatus } from '../../helpers/profile';
import StatusBadge from '@/components/atoms/StatusBadge/StatusBadge';
import FlagUserAlert from '@/components/molecules/FlagUserAlert/FlagUserAlert';
import { Button } from '@/components/ui/button';
import UserActionButton from '../UserActionButton/UserActionButton';

export default function UserProfileCard({ user, kycId, isFlagged = false, flagReason }: {
  user: UserType;
  kycId?: string;
  isFlagged?: boolean;
  flagReason?: string;
}) {
  return (
    <section aria-label="User profile" className="min-w-0 overflow-hidden rounded-2xl border bg-card text-card-foreground dark:bg-gray-900 dark:text-gray-100 dark:border-gray-800 shadow-sm">
      <div className="flex flex-col gap-4 border-b bg-muted/30 dark:border-gray-800 dark:bg-gray-800/50 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex min-w-0 items-center gap-4">
          <div aria-hidden="true" className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-purple-100 text-xl font-semibold text-purple-700 dark:bg-purple-900/40 dark:text-purple-200">
            {user?.first_name?.[0]}{user?.last_name?.[0]}
          </div>
          <div className="min-w-0">
            <p className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground dark:text-gray-400">User profile</p>
            <h2 className="break-words text-xl font-semibold">{user?.first_name} {user?.last_name}</h2>
            <p className="break-all text-sm text-muted-foreground dark:text-gray-400">{user?.user_tag ? `@${user.user_tag}` : 'No user tag'}</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={getProfileStatus(user)} />
          {kycId && <Button asChild variant="outline" size="sm" className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700"><Link href={`/manage-kyc/info/${kycId}`}><ShieldCheck className="size-4" /> Review KYC <ArrowUpRight className="size-4" /></Link></Button>}
        </div>
      </div>
      <div className="grid min-w-0 xl:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="min-w-0 p-4 sm:p-6">
          <h3 className="mb-5 text-sm font-semibold">Personal information</h3>
          <dl className="grid min-w-0 grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2 2xl:grid-cols-3">
            {getProfileFields(user).map(field => <div key={field.label} className="min-w-0 space-y-2">
              <dt className="flex items-center gap-2 text-xs text-muted-foreground dark:text-gray-400"><field.icon aria-hidden="true" className="size-3.5 shrink-0" />{field.label}</dt>
              <dd className="break-words text-sm font-medium [overflow-wrap:anywhere]">{field.value}</dd>
            </div>)}
          </dl>
        </div>
        <aside aria-label="Account controls" className="min-w-0 space-y-4 border-t bg-muted/20 dark:border-gray-800 dark:bg-gray-800/30 p-4 sm:p-6 xl:border-l xl:border-t-0">
          <h3 className="text-sm font-semibold">Account controls</h3>
          <FlagUserAlert userId={user?.id} email={user?.email} isSuspicious={isFlagged} flagReason={flagReason} />
          <div className="space-y-3 rounded-xl border bg-background dark:border-gray-700 dark:bg-gray-900 p-4">
            <div><p className="text-sm font-semibold">Account access</p><p className="mt-1 text-xs text-muted-foreground dark:text-gray-400">{user?.is_blacklisted ? 'Account access is suspended.' : 'Manage this user’s access to their account.'}</p></div>
            <UserActionButton email={user?.email} userId={user?.id} is_blacklisted={user?.is_blacklisted} />
          </div>
        </aside>
      </div>
    </section>
  );
}
