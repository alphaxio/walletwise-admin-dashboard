"use client";

import { useEffect } from "react";
import ErrorFallback from "@/components/ErrorFallback";

export default function PageError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return <main className="min-h-screen p-8"><ErrorFallback reset={reset} /></main>;
}
