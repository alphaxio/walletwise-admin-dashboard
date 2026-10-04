import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import ErrorBoundary from "./ErrorBoundary";
import StatusBubble from "./atoms/StatusBubble/StatusBubble";
import TypeBadge from "./atoms/TypeBadge/TypeBadge";
import { findServiceName } from "@/lib/helpers";
import { formatDate, formatTime } from "@/lib/helpers/dateFormats";

function Broken({ fail }: { fail: boolean }) {
  if (fail) throw new Error("bad record");
  return <p>Recovered content</p>;
}

afterEach(() => { cleanup(); vi.restoreAllMocks(); });

describe("resilient rendering", () => {
  it("handles missing categories without inventing a service", () => {
    expect(findServiceName(null)).toBe("");
    expect(findServiceName(undefined)).toBe("");
    expect(findServiceName(" ")).toBe("");
    expect(findServiceName("AIRTIME")).toBe("airtime");
  });
  it("renders missing badges with neutral labels", () => {
    render(<><StatusBubble status={null} /><TypeBadge type={null} /></>);
    expect(screen.getAllByText("N/A")).toHaveLength(2);
  });
  it("handles invalid dates", () => {
    expect(formatDate("invalid")).toBe("N/A");
    expect(formatTime("")).toBe("N/A");
  });
  it("preserves surrounding content and retries a failed section", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const view = render(<><nav>Navigation</nav><ErrorBoundary><Broken fail /></ErrorBoundary></>);
    expect(screen.getByText("Navigation")).toBeInTheDocument();
    expect(screen.getByRole("alert")).toBeInTheDocument();
    view.rerender(<><nav>Navigation</nav><ErrorBoundary><Broken fail={false} /></ErrorBoundary></>);
    fireEvent.click(screen.getByRole("button", { name: "Try again" }));
    expect(screen.getByText("Recovered content")).toBeInTheDocument();
  });
  it("recovers a failed cell when its record changes", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const view = render(<ErrorBoundary compact resetKey="old"><Broken fail /></ErrorBoundary>);
    expect(screen.getByText("Unavailable")).toBeInTheDocument();
    view.rerender(<ErrorBoundary compact resetKey="new"><Broken fail={false} /></ErrorBoundary>);
    expect(screen.getByText("Recovered content")).toBeInTheDocument();
  });
});
