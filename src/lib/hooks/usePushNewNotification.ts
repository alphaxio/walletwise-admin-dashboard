import { FormEvent, useState } from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/lib/toast";

import { ApiErrorResponse } from "../types";
import { promiseErrorFunction } from "../helpers/promiseError";
import { pushNotification } from "../api/notification";

export const usePushNewNotification = () => {
  const [openModal, setOpenModal] = useState(false);
  const [notificationInfo, setNotificationInfo] = useState({
    subject: "",
    message: "",
  });

  const queryClient = useQueryClient();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNotificationInfo({
      ...notificationInfo,
      [name]: value,
    });
  };

  const resetForm = () => {
    setNotificationInfo({
      subject: "",
      message: "",
    });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: pushNotification,
    onSuccess: () => {
      toast.success("Notification pushed successfully!.");
      resetForm();
      queryClient.invalidateQueries({
        queryKey: ["all notification"],
      });
    },
    onError: (error: ApiErrorResponse) => {
      console.log("error creating admin", error);
      promiseErrorFunction(error);
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!notificationInfo.subject) {
      return toast.error("Subject is required");
    } else if (!notificationInfo.message) {
      return toast.error("Message is required");
    }
    mutate(notificationInfo);
  };

  return {
    handleChange,
    handleSubmit,
    isPending,
    openModal,
    setOpenModal,
    notificationInfo,
  };
};
