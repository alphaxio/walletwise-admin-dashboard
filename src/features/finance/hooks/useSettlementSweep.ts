"use client";

import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { getSettlementSweeps, runSettlementSweep, scanSweepAccounts } from "../api/settlementSweep";
import { chunk, SCAN_PAGE_SIZE, SWEEP_CHUNK_SIZE } from "../helpers/settlementSweep";
import type { SweepAccountRow, SweepResult } from "../types/settlementSweep";

const apiMessage = (error: unknown) =>
  (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
  (error as Error)?.message ||
  "Request failed";

/** Reads every personal account page by page. Read-only. */
export const useSweepScan = () => {
  const [rows, setRows] = useState<SweepAccountRow[]>([]);
  const [total, setTotal] = useState<number | null>(null);
  const [settlementAccount, setSettlementAccount] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const cancelled = useRef(false);

  const start = useCallback(async () => {
    cancelled.current = false;
    setScanning(true);
    setRows([]);
    setTotal(null);
    try {
      let offset = 0;
      let all: SweepAccountRow[] = [];
      for (;;) {
        const page = await scanSweepAccounts(offset, SCAN_PAGE_SIZE);
        all = [...all, ...page.items];
        setRows(all);
        setTotal(page.total);
        setSettlementAccount(page.settlementAccount);
        offset += page.items.length;
        if (cancelled.current || page.items.length === 0 || offset >= page.total) break;
      }
    } catch (error) {
      toast.error(`Scan stopped: ${apiMessage(error)}`);
    } finally {
      setScanning(false);
    }
  }, []);

  const stop = useCallback(() => {
    cancelled.current = true;
  }, []);

  return { rows, total, settlementAccount, scanning, start, stop };
};

/** Sends the approved accounts in small batches. Moves real money. */
export const useRunSweep = () => {
  const queryClient = useQueryClient();
  const [results, setResults] = useState<Record<string, SweepResult>>({});
  const [running, setRunning] = useState(false);

  const run = useCallback(
    async (items: { email: string; amount: number }[], reason: string) => {
      setRunning(true);
      const batchId = crypto.randomUUID();
      let moved = 0;
      try {
        for (const group of chunk(items, SWEEP_CHUNK_SIZE)) {
          try {
            const response = await runSettlementSweep({ batchId, reason, items: group });
            moved += response.movedTotal;
            setResults((prev) => ({ ...prev, ...Object.fromEntries(response.results.map((r) => [r.email, r])) }));
          } catch (error) {
            // The outcome of this group is not known, so stop instead of sending more.
            const message = `Request failed: ${apiMessage(error)}. Check the history before trying again.`;
            setResults((prev) => ({
              ...prev,
              ...Object.fromEntries(group.map((g) => [g.email, { email: g.email, status: "unknown" as const, message }])),
            }));
            toast.error("Sweep stopped. Check the sweep history before running again.");
            break;
          }
        }
        toast.success(`Moved ₦${moved.toLocaleString("en-NG", { minimumFractionDigits: 2 })} to settlement`);
      } finally {
        setRunning(false);
        queryClient.invalidateQueries({ queryKey: ["settlement sweeps"] });
      }
    },
    [queryClient]
  );

  return { results, running, run, clear: () => setResults({}) };
};

export const useSweepHistory = (page: number, limit: number) =>
  useQuery({
    queryKey: ["settlement sweeps", page],
    queryFn: () => getSettlementSweeps({ page, limit }),
  });
