import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#faf7f0_0%,#ffffff_55%,#f5f5f4_100%)] px-6 py-24 text-stone-950 md:px-10">
      <div className="mx-auto flex max-w-3xl flex-col items-start rounded-[32px] border border-stone-200 bg-white/90 p-10 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-stone-400">
          404
        </p>
        <h1 className="mt-4 font-serif text-4xl leading-tight text-stone-950 md:text-5xl">
          This page doesn&apos;t exist.
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-600 md:text-base">
          The link may be broken, the page may have moved, or the URL may be
          incorrect.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/"
            className="rounded-xl bg-stone-900 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-stone-700"
          >
            Go Home
          </Link>
        </div>
      </div>
    </main>
  );
}
