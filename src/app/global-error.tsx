"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[linear-gradient(180deg,#111827_0%,#0f172a_60%,#1c1917_100%)] px-6 py-24 text-white md:px-10">
        <main className="mx-auto max-w-3xl rounded-[32px] border border-white/10 bg-white/5 p-10 shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/50">
            Fatal Error
          </p>
          <h1 className="mt-4 font-serif text-4xl leading-tight text-white md:text-5xl">
            The application hit a critical error.
          </h1>
          <p className="mt-4 text-sm leading-7 text-white/72 md:text-base">
            Refresh the page or retry the last action. If this keeps happening,
            inspect the server logs.
          </p>
          {error.digest ? (
            <p className="mt-4 text-xs uppercase tracking-[0.2em] text-white/45">
              Ref: {error.digest}
            </p>
          ) : null}
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={reset}
              className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-stone-950 transition-colors hover:bg-stone-200"
            >
              Try Again
            </button>
            <a
              href="/"
              className="rounded-xl border border-white/12 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/8"
            >
              Go Home
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}
