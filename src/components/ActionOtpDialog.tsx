"use client";

import { useEffect, useRef, useState } from "react";
import type { AxiosResponse } from "axios";
import { REGEXP_ONLY_DIGITS } from "input-otp";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { axiosInstance } from "@/lib/axiosInstance";
import { isActionOtpError, setActionOtpHandler, type ActionOtpPrompt } from "@/lib/actionOtp";

const LABELS: Record<string, string> = {
  wallet_adjustment: "wallet adjustment",
  settlement_sweep: "settlement sweep",
  usd_rates: "USD rate change",
  rate_update: "rate change",
  gift_card_rate: "gift card rate change",
};

const RESEND_SECONDS = 30;

type Pending = ActionOtpPrompt & {
  resolve: (res: AxiosResponse) => void;
  reject: (reason?: unknown) => void;
};

const apiMessage = (error: unknown, fallback: string) => {
  const message = (error as { response?: { data?: { message?: unknown } } })?.response?.data?.message;
  return typeof message === "string" && message.trim() ? message : fallback;
};

/**
 * Asks for an approval code when the API says a sensitive action needs one.
 * The code is emailed to the approvers, who read it to the admin doing the action.
 * Mounted once in the root layout.
 */
export default function ActionOtpDialog() {
  const [pending, setPending] = useState<Pending | null>(null);
  const [code, setCode] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const pendingRef = useRef<Pending | null>(null);

  useEffect(() => {
    setActionOtpHandler(
      (prompt) =>
        new Promise<AxiosResponse>((resolve, reject) => {
          // Only one approval at a time; a second one cancels the first.
          pendingRef.current?.reject();
          const next = { ...prompt, resolve, reject };
          pendingRef.current = next;
          setPending(next);
          setCode("");
          setSent(false);
          setError("");
          setCooldown(0);
        }),
    );
    return () => setActionOtpHandler(null);
  }, []);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const close = (reason?: unknown) => {
    // No reason = cancelled: the screen gets the API's "approval code required" error.
    pendingRef.current?.reject(reason);
    pendingRef.current = null;
    setPending(null);
  };

  const sendCode = async () => {
    if (!pending) return;
    setBusy(true);
    setError("");
    try {
      await axiosInstance.post("/action-otp/request", {
        action: pending.action,
        resourceId: pending.resourceId,
        body: pending.body,
      });
      setSent(true);
      setCooldown(RESEND_SECONDS);
    } catch (err) {
      setError(apiMessage(err, "Could not send the approval code. Please try again."));
    } finally {
      setBusy(false);
    }
  };

  const confirm = async () => {
    if (!pending || code.length !== 6) return;
    setBusy(true);
    setError("");
    try {
      const res = await pending.submit(code);
      pending.resolve(res);
      pendingRef.current = null;
      setPending(null);
    } catch (err) {
      if (isActionOtpError(err)) {
        // Wrong, expired or used code: stay open so they can try again or ask for a new one.
        setError(apiMessage(err, "That code did not work."));
        setCode("");
      } else {
        // The code was accepted but the action itself failed: let the screen show why.
        close(err);
      }
    } finally {
      setBusy(false);
    }
  };

  const label = pending ? LABELS[pending.action] ?? "this action" : "";

  return (
    <Dialog open={!!pending} onOpenChange={(open) => !open && !busy && close()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Approval needed</DialogTitle>
          <DialogDescription>
            This {label} needs an approval code. The code is emailed to the approvers. Ask one of them for it.
          </DialogDescription>
        </DialogHeader>

        {sent ? (
          <div className="flex flex-col items-center gap-3 py-2">
            <InputOTP
              maxLength={6}
              pattern={REGEXP_ONLY_DIGITS}
              value={code}
              onChange={setCode}
              disabled={busy}
              autoFocus
            >
              <InputOTPGroup>
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <InputOTPSlot key={i} index={i} />
                ))}
              </InputOTPGroup>
            </InputOTP>
            <p className="text-xs text-muted-foreground">The code expires in 10 minutes.</p>
          </div>
        ) : null}

        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        <DialogFooter className="gap-2 sm:gap-2">
          <Button variant="outline" onClick={() => close()} disabled={busy}>
            Cancel
          </Button>
          {sent ? (
            <>
              <Button variant="outline" onClick={sendCode} disabled={busy || cooldown > 0}>
                {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend code"}
              </Button>
              <Button onClick={confirm} disabled={busy || code.length !== 6}>
                {busy ? "Confirming..." : "Confirm"}
              </Button>
            </>
          ) : (
            <Button onClick={sendCode} disabled={busy}>
              {busy ? "Sending..." : "Send code to approvers"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
