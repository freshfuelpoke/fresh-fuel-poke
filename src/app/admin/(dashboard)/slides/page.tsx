import { asc } from "drizzle-orm";
import { Suspense } from "react";
import { db } from "@/db";
import { heroSlides } from "@/db/schema";
import { SlidesManager } from "./slides-manager";

async function SlidesPageContent() {
  const slides = await db
    .select()
    .from(heroSlides)
    .orderBy(asc(heroSlides.displayOrder));

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-stone-100">
        <div>
          <h2 className="font-semibold text-stone-800">Slides Preview</h2>
          <p className="text-xs text-stone-400 mt-0.5">
            Label renders at the top. Accent renders at the bottom.
          </p>
        </div>
      </div>
      <div className="p-6">
        <SlidesManager slides={slides} />
      </div>
    </div>
  );
}

function SlidesPageFallback() {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-6 text-sm text-stone-500 shadow-sm">
      Loading slides...
    </div>
  );
}

export default function SlidesPage() {
  return (
    <div className="space-y-8">
      <div>
        <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">
          Admin
        </p>
        <h1 className="text-3xl font-serif text-stone-900">Hero Slides</h1>
        <p className="mt-1 text-sm text-stone-500">
          Edit the fixed three homepage carousel slides.
        </p>
      </div>

      <Suspense fallback={<SlidesPageFallback />}>
        <SlidesPageContent />
      </Suspense>
    </div>
  );
}
