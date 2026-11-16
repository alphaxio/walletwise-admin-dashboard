import { useState } from "react";

import { toast } from "@/lib/toast";
import { QueryClient, useMutation } from "@tanstack/react-query";

import { createRole } from "../api/roles";
import { ApiErrorResponse } from "../types";
import { promiseErrorFunction } from "../helpers/promiseError";

export const useCreateNewAdminRole = () => {
  const queryClient = new QueryClient();

  const [isMoadalOpen, setIsModalOpen] = useState(false);
  const [permissions, setPermissions] = useState<string[]>([]);

  const onSelectPermission = (id: string) => {
    const updatedSelection = permissions.includes(id)
      ? permissions.filter((selectedId) => selectedId !== id)
      : [...permissions, id];

    setPermissions(updatedSelection);
  };

  const handleSelectAllPermissions = (permissionIds: string[]) => {
    const allSelected = permissionIds.every((id: string) =>
      permissions.includes(id),
    );
    const updatedSelection = allSelected
      ? permissions.filter((id) => !permissionIds.includes(id))
      : [...new Set([...permissions, ...permissionIds])];

    setPermissions(updatedSelection);
  };

  const { mutate, isPending } = useMutation({
    mutationFn: createRole,
    onSuccess: () => {
      setIsModalOpen(false);
      toast.success("Role created successfully!.");
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
    onError: (error: ApiErrorResponse) => {
      console.error("Error creating role:", error);
      promiseErrorFunction(error);
    },
  });

  const handleCreateRole = (e: React.FormEvent, roleName: string) => {
    e.preventDefault();
    if (!roleName.trim()) {
      toast.error("Role name cannot be empty.");
      return;
    }
    if (permissions.length === 0) {
      toast.error("Please select at least one permission.");
      return;
    }
    mutate({ name: roleName, permissionIds: permissions });
  };

  return {
    isMoadalOpen,
    setIsModalOpen,
    permissions,
    onSelectPermission,
    handleSelectAllPermissions,
    handleCreateRole,
    isCreating: isPending,
  };
};
