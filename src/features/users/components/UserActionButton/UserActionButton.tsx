"use client";

import { Button } from '@/components/ui/button';
import UpdateUserStatusModal from '@/components/molecules/modals/UpdateUserStatusModal/UpdateUserStatusModal';
import { useUserAccountActions } from '../../hooks/useUserAccountActions';

export default function UserActionButton({ userId, email, is_blacklisted }: {
  userId: string;
  email: string;
  is_blacklisted: boolean;
}) {
  const { suspension, reactivation, submitSuspension, submitReactivation, openAccountDialog } = useUserAccountActions(userId, email, is_blacklisted);

  return (
    <div className="w-full">
      <Button variant={is_blacklisted ? 'outline' : 'destructive'} className="w-full" onClick={openAccountDialog}>
        {is_blacklisted ? 'Activate Account' : 'Suspend Account'}
      </Button>
      <UpdateUserStatusModal
        openModal={suspension.isOpen}
        messageContent={suspension.messageContent}
        setMessage={suspension.setMessage}
        setOpenModal={suspension.setIsOpen}
        isLoading={suspension.isPending}
        onSubmit={submitSuspension}
        title="Suspend user"
        description="Are you sure you want to suspend this user? They will lose access to their account until they are reactivated"
      />
      <UpdateUserStatusModal
        openModal={reactivation.open}
        messageContent={reactivation.msg}
        setMessage={reactivation.setMsg}
        setOpenModal={reactivation.setOpen}
        isLoading={reactivation.isReactivating}
        onSubmit={submitReactivation}
        title="Activate user"
        description="Are you sure you want to reactivate this user? They will regain access to their account immediately"
      />
    </div>
  );
}
