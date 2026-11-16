import { describe, expect, it, vi } from "vitest";
import { toast } from "./toast";
import { toast as sonnerToast } from "sonner";

describe("toast dismissal policy", () => {
  it("keeps errors open even when a caller supplies a shorter duration", () => {
    const error = vi.spyOn(sonnerToast, "error");
    toast.error("Unable to approve KYC", { duration: 3000 });
    expect(error).toHaveBeenCalledWith("Unable to approve KYC", {
      duration: Infinity,
      closeButton: true,
    });
    error.mockRestore();
    toast.dismiss();
  });

  it("preserves Sonner's success and dismissal API", () => {
    expect(toast.success).toBe(sonnerToast.success);
    expect(toast.dismiss).toBe(sonnerToast.dismiss);
  });
});
