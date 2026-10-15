import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import RateSettings from "./RateSettings";
const mutate = vi.fn();
vi.mock("../../hooks/useFinancialData", () => ({
  useFinancialRecord: () => ({
    isPending: false,
    isError: false,
    refetch: vi.fn(),
    data: {
      flexApy: 10,
      goalApy: 12,
      lock30To60Apy: 12,
      lock61To90Apy: 13,
      lock91To180Apy: 14,
      lock181To365Apy: 15,
      earlyLiquidationPenalty: 2.5,
      penaltyMode: "percentage",
    },
  }),
  useFinancialMutation: () => ({ mutate, isPending: false }),
}));
describe("savings rate changes", () => {
  afterEach(cleanup);
  beforeEach(() => mutate.mockClear());
  it("requires review and confirmation before saving", () => {
    render(<RateSettings type="savings" />);
    fireEvent.change(screen.getByLabelText("Flex Save APY (%)"), {
      target: { value: "11" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Review changes" }));
    expect(mutate).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "Confirm and save" }));
    expect(mutate).toHaveBeenCalledWith(
      expect.objectContaining({
        path: "savings/rates",
        method: "put",
        body: expect.objectContaining({
          flexApy: 11,
          penaltyMode: "percentage",
        }),
      }),
      expect.any(Object),
    );
  });
  it("blocks negative and missing rates", () => {
    render(<RateSettings type="savings" />);
    fireEvent.change(screen.getByLabelText("Flex Save APY (%)"), {
      target: { value: "-1" },
    });
    expect(
      (
        screen.getByRole("button", {
          name: "Review changes",
        }) as HTMLButtonElement
      ).disabled,
    ).toBe(true);
    fireEvent.change(screen.getByLabelText("Flex Save APY (%)"), {
      target: { value: "" },
    });
    expect(
      (
        screen.getByRole("button", {
          name: "Review changes",
        }) as HTMLButtonElement
      ).disabled,
    ).toBe(true);
  });
});
