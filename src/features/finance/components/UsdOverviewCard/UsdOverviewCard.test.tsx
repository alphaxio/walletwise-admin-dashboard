import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import OverviewSummary from "@/components/molecules/OverviewSummary/OverviewSummary";
import UsdOverviewCard from "./UsdOverviewCard";
const { fetchList, auth } = vi.hoisted(() => ({
  fetchList: vi.fn(),
  auth: { user: { permissions: [] as string[] } },
}));
vi.mock("../../api/index", () => ({ fetchList }));
vi.mock("react-redux", () => ({
  useSelector: (select: (state: unknown) => unknown) => select({ auth }),
}));
vi.mock("@/lib/hooks/useGetGeneralStat", () => ({
  useGetGeneralStat: () => ({
    data: { totalRevenue: 10, totalProfit: 5, totalUsers: 2, totalDisputes: 0 },
    isLoading: false,
  }),
}));
afterEach(cleanup);
beforeEach(() => {
  fetchList.mockReset();
  fetchList.mockResolvedValue({
    records: [],
    metrics: { totalFees: 9.5, totalVolumeIn: 7.23 },
  });
  auth.user.permissions = [];
});
function mount(child: React.ReactNode) {
  return render(
    <QueryClientProvider
      client={
        new QueryClient({ defaultOptions: { queries: { retry: false } } })
      }
    >
      {child}
    </QueryClientProvider>,
  );
}
it("hides and never requests USD totals without the existing revenue permissions", () => {
  mount(<OverviewSummary />);
  expect(screen.queryByText("Total USD revenue")).toBeNull();
  expect(fetchList).not.toHaveBeenCalled();
});
it("displays fee revenue for an authorized administrator", async () => {
  auth.user.permissions = ["admin_management.read"];
  mount(<OverviewSummary />);
  await waitFor(() =>
    expect(screen.getByText("Total USD revenue")).toBeTruthy(),
  );
  expect(screen.getByText("US$9.50")).toBeTruthy();
  expect(fetchList).toHaveBeenCalledWith(
    "usd/transactions",
    expect.objectContaining({ status: "", limit: 1 }),
    expect.any(AbortSignal),
  );
});
it("labels wallet inflow separately from fee revenue", async () => {
  mount(<UsdOverviewCard metric="inflow" />);
  await waitFor(() =>
    expect(screen.getByText("Total USD inflow")).toBeTruthy(),
  );
  expect(screen.getByText("US$7.23")).toBeTruthy();
});
