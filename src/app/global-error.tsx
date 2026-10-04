"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "sans-serif", padding: "2rem" }}>
        <main role="alert">
          <h1>WalletWise could not load</h1>
          <p>An unexpected application error occurred. Try again or reload the page.</p>
          <button onClick={reset}>Try again</button>{" "}
          <button onClick={() => window.location.reload()}>Reload page</button>{" "}
          <a href="/overview">Go to overview</a>
        </main>
      </body>
    </html>
  );
}
