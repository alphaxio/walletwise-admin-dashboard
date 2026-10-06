"use client";

import { useState } from "react";

import { QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { toast } from "sonner";

interface QueryProviderProps {
  children: React.ReactNode;
}

export default function QueryProvider({ children }: QueryProviderProps) {
  const [queryClient] = useState(() => new QueryClient({
    queryCache: new QueryCache({
      onError: () => toast.error("Unable to load data. Please check your connection and try again.", { id: "query-error" }),
    }),
  }));

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
