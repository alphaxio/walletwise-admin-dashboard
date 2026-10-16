'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { resolveUserIdByEmail } from '../api/resolveUser';
export function useUserProfileLink(email?: string) {
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

  return {pending,openProfile};
}
