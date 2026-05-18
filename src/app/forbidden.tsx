import Link from "next/link";

export default function ForbiddenPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#fff7ed_0%,#ffffff_55%,#f5f5f4_100%)] px-6 py-24 text-stone-950 md:px-10">
      <div className="mx-auto max-w-3xl rounded-[32px] border border-stone-200 bg-white/90 p-10 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-stone-400">
          Forbidden
        </p>
        <h1 className="mt-4 font-serif text-4xl leading-tight text-stone-950 md:text-5xl">
          You don&apos;t have access to this action.
        </h1>
        <p className="mt-4 text-sm leading-7 text-stone-600 md:text-base">
          This area is restricted to users with the required permissions.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/admin"
            className="rounded-xl bg-stone-900 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-stone-700"
          >
            Back To Admin
          </Link>
          <Link
            href="/"
            className="rounded-xl border border-stone-200 px-5 py-3 text-sm font-semibold text-stone-700 transition-colors hover:bg-stone-100"
          >
            Go Home
          </Link>
        </div>
      </div>
    </main>
  );
}
