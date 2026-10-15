'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import UserTableLink from '@/components/atoms/UserTableLink/UserTableLink';
import { resolveUserIdByEmail } from '../../api/resolveUser';

export default function UserProfileLink({ name, id, email }: { name: string; id?: string; email?: string }) {
  const router = useRouter();
  const client = useQueryClient();
  const [pending, setPending] = useState(false);

  async function openProfile() {
    if (!email || pending) return;
    setPending(true);
    try {
      const userId = await client.fetchQuery({
        queryKey: ['user-profile-id', email.trim().toLowerCase()],
        queryFn: () => resolveUserIdByEmail(email),
        staleTime: 5 * 60 * 1000,
      });
      router.push(`/manage-user/info/${encodeURIComponent(userId)}`);
    } catch {
      toast.error('Unable to open this user profile. Please retry.');
    } finally {
      setPending(false);
    }
  }

  if (id) return <UserTableLink name={name} id={encodeURIComponent(id)} />;
  if (!email) return <span>{name}</span>;
  return <button type="button" onClick={openProfile} disabled={pending} aria-busy={pending} className="text-purple-600 dark:text-purple-400 hover:underline capitalize cursor-pointer disabled:opacity-50">{name}{pending && <span className="sr-only"> — Opening profile</span>}</button>;
}
