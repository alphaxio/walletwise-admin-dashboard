'use client';

import { useUserProfileLink } from '../../hooks/useUserProfileLink';
import UserTableLink from '@/components/atoms/UserTableLink/UserTableLink';

export default function UserProfileLink({ name, id, email }: { name: string; id?: string; email?: string }) {
  const {pending,openProfile} = useUserProfileLink(email);

  if (id) return <UserTableLink name={name} id={encodeURIComponent(id)} />;
  if (!email) return <span>{name}</span>;
  return <button type="button" onClick={openProfile} disabled={pending} aria-busy={pending} className="text-purple-600 dark:text-purple-400 hover:underline capitalize cursor-pointer disabled:opacity-50">{name}{pending && <span className="sr-only"> — Opening profile</span>}</button>;
}
