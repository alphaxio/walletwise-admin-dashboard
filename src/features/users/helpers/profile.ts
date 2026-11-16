import { CalendarDays, Fingerprint, Mail, Phone, UserRound } from 'lucide-react';
import { convertDateFormat } from '@/lib/helpers/dateFormats';
import type { UserType } from '../types';

export function getProfileStatus(user?: UserType) {
  if (user?.is_blacklisted || user?.account_status === 'inactive') return 'suspended';
  if (user?.account_status === 'active') return 'Personalized account';
  return 'Virtual account';
}

export function getProfileFields(user?: UserType) {
  return [
    { label: 'First name', value: user?.first_name || '—', icon: UserRound },
    { label: 'Last name', value: user?.last_name || '—', icon: UserRound },
    { label: 'Email address', value: user?.email || '—', icon: Mail },
    { label: 'Phone number', value: user?.phone_number || '—', icon: Phone },
    { label: 'User ID', value: user?.id || '—', icon: Fingerprint },
    { label: 'Member since', value: user?.created_at ? convertDateFormat(user.created_at) : '—', icon: CalendarDays },
  ];
}

export function getLogActivityColor(type: string) {
  if (type.includes('unsuspended')) return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400';
  if (type.includes('suspended')) return 'bg-red-500/10 text-red-600 dark:text-red-400';
  return 'bg-blue-500/10 text-blue-600 dark:text-blue-400';
}
