"use client";

import { FormEvent, useState } from "react";

import Button from "@/components/atoms/Button/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useInvalidateEventToken } from "../../hooks/useInvalidateEventToken";

const InvalidateTokenForm = ({ eventId }: { eventId: string }) => {
  const [tokenCode, setTokenCode] = useState("");

  const invalidation = useInvalidateEventToken(eventId);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedTokenCode = tokenCode.trim();
    if (!normalizedTokenCode || invalidation.isPending) return;

    invalidation.mutate(
      { tokenCode: normalizedTokenCode },
      { onSuccess: () => setTokenCode("") },
    );
  };

  return (
    <section className="mx-auto max-w-xl rounded-xl border bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
        Invalidate a Token
      </h2>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Enter the token code exactly as it appears on the attendee&apos;s token.
      </p>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="token-id">Token code</Label>
          <Input
            id="token-id"
            value={tokenCode}
            onChange={(event) => setTokenCode(event.target.value)}
            placeholder="TOK-XXXXXXX"
            autoComplete="off"
            disabled={invalidation.isPending}
          />
        </div>
        <Button
          type="submit"
          width="w-auto"
          disabled={!tokenCode.trim() || invalidation.isPending}
          loading={invalidation.isPending}
        >
          Invalidate Token
        </Button>
      </form>
    </section>
  );
};

export default InvalidateTokenForm;
