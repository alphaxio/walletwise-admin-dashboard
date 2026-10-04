"use client";

export default function ErrorFallback({
  reset,
  message = "This section could not be displayed. Please try again.",
}: {
  reset: () => void;
  message?: string;
}) {
  return (
    <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-6 text-gray-900 space-y-3">
      <h2 className="text-lg font-semibold">Something went wrong</h2>
      <p>{message}</p>
      <button type="button" onClick={reset} className="rounded border px-4 py-2 font-medium">Try again</button>
      <a href="/overview" className="ml-4 underline">Go to overview</a>
    </div>
  );
}
