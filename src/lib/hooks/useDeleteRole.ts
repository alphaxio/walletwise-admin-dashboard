import { useState } from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/lib/toast";

import { ApiErrorResponse } from "../types";
import { deleteRole } from "../api/roles";
import { promiseErrorFunction } from "../helpers/promiseError";

export const useDeleteRole = () => {
  const queryClient = useQueryClient();

  const [openModal, setOpenModal] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: deleteRole,
    onSuccess: () => {
      toast.success("Role deleted successfully!.");
      setOpenModal(false);
      queryClient.invalidateQueries({
        queryKey: ["roles"],
      });
    },
    onError: (error: ApiErrorResponse) => {
      console.log("error deleting role", error);
      promiseErrorFunction(error);
    },
  });

  const handleDelete = (roleId: string) => {
    mutate(roleId);
  };

  return {
    openModal,
    setOpenModal,
    handleDelete,
    isDeleting: isPending,
  };
};
