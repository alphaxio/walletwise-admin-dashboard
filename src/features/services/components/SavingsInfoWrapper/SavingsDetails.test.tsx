import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import SavingsDetails from "./SavingsDetails";

const valueFor = (label: string) => screen.getByText(label, { selector: "dt" }).nextElementSibling;
afterEach(cleanup);

describe("Savings details", () => {
  it("maps the savings response including metadata, zero balances, and false flags", () => {
    render(<SavingsDetails data={{
      id: 875, reference: "test-reference", savings_account_id: 513,
      userID: "customer@example.com", user_uuid: "test-user", first_name: "Test", last_name: "Customer",
      amount: "41000.00", balance_before: "0.00", balance_after: "41000.00",
      transaction_type: "credit", transaction_category: "deposit", plan_type: "lock",
      current_plan_balance: "41000.00", interest_rate: "14.00", plan_status: "active", user_flagged: false,
      transaction_created_at: "2026-10-04T15:24:13+01:00",
      plan_meta_data: { name: "gold thrift", durationDays: 61, maturityDate: "2026-12-04T15:24:13+01:00", interestAmount: "959.29", interestPayoutMode: "maturity", upfrontInterestPaid: false },
    }} />);
    expect(valueFor("Email")).toHaveTextContent("customer@example.com");
    expect(valueFor("Interest rate")).toHaveTextContent("14%");
    expect(valueFor("Interest amount")).toHaveTextContent("959.29");
    expect(valueFor("Duration")).toHaveTextContent("61 days");
    expect(valueFor("Plan name")).toHaveTextContent("gold thrift");
    expect(valueFor("Maturity date")).toHaveTextContent("Dec");
    expect(valueFor("Upfront interest paid")).toHaveTextContent("No");
    expect(valueFor("User flagged")).toHaveTextContent("No");
    expect(screen.getByRole("link", { name: "test-user" })).toHaveAttribute("href", "/manage-user/info/test-user");
    expect(screen.getByText("₦0.00")).toBeInTheDocument();
  });

  it("shows missing or invalid values without inventing amounts, dates, or flags", () => {
    const { container } = render(<SavingsDetails data={{ plan_meta_data: null, amount: "invalid", interest_rate: "", transaction_created_at: "invalid" }} />);
    expect(valueFor("Interest rate")).toHaveTextContent("N/A");
    expect(valueFor("Interest amount")).toHaveTextContent("N/A");
    expect(valueFor("Transaction date")).toHaveTextContent("N/A");
    expect(valueFor("Upfront interest paid")).toHaveTextContent("N/A");
    expect(container).not.toHaveTextContent(/NaN|Invalid Date|undefined/);
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });
});
