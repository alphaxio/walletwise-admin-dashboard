import { FormEvent, useState } from "react";

import { toast } from "@/lib/toast";
import { QueryClient, useMutation } from "@tanstack/react-query";

import { createPermission } from "../api/permission";
import { promiseErrorFunction } from "../helpers/promiseError";
import { ApiErrorResponse } from "../types";

export const useCreatePermission = () => {
  const queryClient = new QueryClient();

  const [open, setOpen] = useState(false);
  const [permission, setPermission] = useState("");

  const { mutate, isPending } = useMutation({
    mutationFn: createPermission,
    onSuccess: () => {
      toast.success("Permission created successfully!.");
      setOpen(false);
      setPermission("");
      queryClient.invalidateQueries({ queryKey: ["permissions"] });
    },
    onError: (error: ApiErrorResponse) => {
      console.log("error creating permission", error);
      promiseErrorFunction(error);
    },
  });

  const handleCreatePermission = (e: FormEvent) => {
    e.preventDefault();
    if (!permission) {
      toast.error("Permission name is required.");
      return;
    }
    mutate({ name: permission });
  };

  return {
    open,
    setOpen,
    permission,
    setPermission,
    handleCreatePermission,
    isCreating: isPending,
  };
};
