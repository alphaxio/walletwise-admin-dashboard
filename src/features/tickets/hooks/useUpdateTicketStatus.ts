import { FormEvent, useState } from "react";

import { toast } from "@/lib/toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { ApiErrorResponse } from "@/lib/types";
import { updateTicketStatus } from "../api";
import { promiseErrorFunction } from "@/lib/helpers/promiseError";

export const useUpdateTicketStatus = (ticketId: string) => {
  const queryClient = useQueryClient();

  const [messageContent, setMessageContent] = useState("");
  const [disputeRes, setDisputeRes] = useState({
    status: "",
    subject: "",
  });

  const onReset = () => {
    setMessageContent("");
    setDisputeRes({ status: "", subject: "" });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setDisputeRes({
      ...disputeRes,
      [name]: value,
    });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: updateTicketStatus,
    onSuccess: (data, variables) => {
      toast.success("Dispute update successfully!");
      onReset();
      queryClient.invalidateQueries({
        queryKey: ["all tickets"],
      });
      queryClient.invalidateQueries({
        queryKey: ["ticket info", variables.ticketId],
      });
    },
    onError: (error: ApiErrorResponse) => {
      promiseErrorFunction(error);
    },
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const { status, subject } = disputeRes;
    if (!status) {
      toast.error("Please select status");
      return;
    } else if (!subject) {
      toast.error("Please enter a subject");
      return;
    } else if (!messageContent) {
      toast.error("Please enter a message");
      return;
    }

    mutate({ ticketId, status, subject, messageContent });
  };

  return {
    handleSubmit,
    isPending,
    messageContent,
    setMessageContent,
    handleChange,
    disputeRes,
  };
};
