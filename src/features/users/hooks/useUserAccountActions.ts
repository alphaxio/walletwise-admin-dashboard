import type { FormEvent } from 'react';
import { useSuspendUser } from './useSuspendUser';
import { useReactivateUser } from './useReactivateUser';

export function useUserAccountActions(userId: string, email: string, isBlacklisted: boolean) {
  const suspension = useSuspendUser(userId);
  const reactivation = useReactivateUser(userId);

  function submitSuspension(event: FormEvent) {
    event.preventDefault();
    suspension.handleSubmit(event, email);
  }
  function submitReactivation(event: FormEvent) {
    event.preventDefault();
    reactivation.handleReactivate(event, email);
  }
  function openAccountDialog() {
    if (isBlacklisted) reactivation.setOpen(true);
    else suspension.setIsOpen(true);
  }
  return { suspension, reactivation, submitSuspension, submitReactivation, openAccountDialog };
}
