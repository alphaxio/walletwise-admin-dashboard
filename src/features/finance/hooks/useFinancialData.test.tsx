import { act, cleanup, renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useFinancialList } from "./useFinancialData";
const { fetchList } = vi.hoisted(() => ({ fetchList: vi.fn() }));
vi.mock("../api", () => ({
  fetchList,
  fetchRecord: vi.fn(),
  mutateRecord: vi.fn(),
}));
afterEach(cleanup);
describe("KYC status filtering", () => {
  it("fetches all initially and applies only the selected status, resetting pagination", async () => {
    fetchList.mockResolvedValue({
      records: [],
      total: 0,
      totalPages: 1,
      metrics: {},
    });
    const client = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    );
    const { result } = renderHook(() => useFinancialList("usd/kyc"), {
      wrapper,
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.filters).toMatchObject({
      status: "",
      page: 1,
      limit: 10,
    });
    act(() => result.current.update({ page: 3 }));
    act(() => result.current.update({ status: "active" }));
    await waitFor(() =>
      expect(fetchList).toHaveBeenCalledWith(
        "usd/kyc",
        expect.objectContaining({ status: "active", page: 1 }),
        expect.any(AbortSignal),
      ),
    );
    act(() => result.current.update({ status: "" }));
    expect(result.current.filters.status).toBe("");
  });
});
