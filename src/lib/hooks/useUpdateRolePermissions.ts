import { FormEvent, useState } from "react";

import { toast } from "@/lib/toast";
import { QueryClient, useMutation } from "@tanstack/react-query";

import { ApiErrorResponse } from "../types";
import { promiseErrorFunction } from "../helpers/promiseError";
import { updateRole } from "../api/roles";

export const useUpdateRolePermissions = () => {
  const queryClient = new QueryClient();

  const [isOpen, setIsOpen] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const handleToggle = (id: string) => {
    const updatedSelection = selectedPermissions.includes(id)
      ? selectedPermissions.filter((selectedId) => selectedId !== id)
      : [...selectedPermissions, id];

    setSelectedPermissions(updatedSelection);
  };

  const handleSelectAll = (permissionIds: string[]) => {
    const allSelected = permissionIds.every((id: string) =>
      selectedPermissions.includes(id),
    );
    const updatedSelection = allSelected
      ? selectedPermissions.filter((id) => !permissionIds.includes(id))
      : [...new Set([...selectedPermissions, ...permissionIds])];

    setSelectedPermissions(updatedSelection);
  };

  const { mutate, isPending } = useMutation({
    mutationFn: updateRole,
    onSuccess: () => {
      setIsOpen(false);
      toast.success("Role permissions updated successfully!.");
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
    onError: (error: ApiErrorResponse) => {
      console.error("Error updating role permissions:", error);
      promiseErrorFunction(error);
    },
  });

  const handleUpdatePermissions = (
    e: FormEvent,
    roleName: string,
    roleId: string,
  ) => {
    e.preventDefault();
    if (selectedPermissions.length === 0) {
      toast.error("Please select at least one permission.");
      return;
    }
    mutate({ roleId, permissionIds: selectedPermissions, name: roleName });
  };

  return {
    isOpen,
    setIsOpen,
    selectedPermissions,
    handleToggle,
    handleSelectAll,
    setSelectedPermissions,
    handleUpdatePermissions,
    isUpdating: isPending,
  };
};
