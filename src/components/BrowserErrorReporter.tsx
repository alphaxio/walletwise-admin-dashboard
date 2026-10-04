"use client";

import { useEffect } from "react";
import { toast } from "sonner";

// Event handlers and asynchronous callbacks are outside React error boundaries.
export default function BrowserErrorReporter() {
  useEffect(() => {
    const report = () => {
      toast.error("An unexpected error occurred. Please retry the action or reload the page.", {
        id: "browser-error",
        action: { label: "Reload", onClick: () => window.location.reload() },
      });
    };
    window.addEventListener("error", report);
    window.addEventListener("unhandledrejection", report);
    return () => {
      window.removeEventListener("error", report);
      window.removeEventListener("unhandledrejection", report);
    };
  }, []);
  return null;
}
