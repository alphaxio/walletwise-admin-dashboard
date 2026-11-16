import { useFlagUser } from './useFlagUser';

export function useUserFlagControls(userId: string, email: string, isSuspicious: boolean) {
  const flag = useFlagUser(userId);
  function openFlagDialog() { flag.setIsOpen(true); }
  function submitFlag() { flag.flagUserAccount(email, !isSuspicious); }
  return { ...flag, openFlagDialog, submitFlag };
}
