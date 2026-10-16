import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader } from "lucide-react";

const ConfirmAction = ({
  open,
  title,
  description,
  onCancel,
  onConfirm,
  isPending,
  setOpen,
  children,
  confirmDisabled = false,
  keepOpenOnConfirm = false,
}: {
  children?: React.ReactNode;
  confirmDisabled?: boolean;
  keepOpenOnConfirm?: boolean;
  title: string;
  description: string;
  onCancel: () => void;
  onConfirm: () => void;
  open: boolean;
  isPending: boolean;
  setOpen: (value: boolean) => void;
}) => {
  return (
    <AlertDialog open={open} onOpenChange={value => { if (!isPending) setOpen(value); }}>
      <AlertDialogContent className="dark:bg-gray-900">
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        {children}
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending} onClick={onCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={event => { if (keepOpenOnConfirm) event.preventDefault(); onConfirm(); }} disabled={isPending || confirmDisabled}>
            {isPending ? (
              <Loader className="animate-spin w-8 h-8" />
            ) : (
              "Continue"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmAction;
