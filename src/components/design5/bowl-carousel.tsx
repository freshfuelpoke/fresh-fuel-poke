"use client";

import Image from "next/image";
import { useEffect, useEffectEvent, useRef, useState } from "react";
import {
  type DishDetails,
  DishModal,
} from "@/components/restaurant/dish-modal";

export type Bowl = DishDetails & {
  tags: readonly string[];
};

type MenuItem = {
  readonly name: string;
  readonly price?: string;
  readonly image?: string | null;
  readonly description?: string | null;
  readonly ingredients?: string | null;
  readonly calories?: string | null;
  readonly protein?: string | null;
  readonly fats?: string | null;
  readonly carbs?: string | null;
  readonly vitaminC?: string | null;
  readonly tags?: string | null;
};

export function BowlCarousel({
  tone = "light",
  items,
}: {
  tone?: "light" | "dark";
  items: readonly MenuItem[];
}) {
  const bowls: Bowl[] = items.map((item) => {
    return {
      name: item.name,
      image: item.image || "",
      description: item.description || "",
      ingredients: item.ingredients || "",
      price: item.price ?? "98",
      isSignature: true,
      nutrition:
        item.calories ||
        item.protein ||
        item.fats ||
        item.carbs ||
        item.vitaminC
          ? {
              calories: item.calories || "",
              protein: item.protein || "",
              fats: item.fats || "",
              carbs: item.carbs || "",
              vitC: item.vitaminC || "",
            }
          : undefined,
      tags: item.tags ? item.tags.split(",").map((t) => t.trim()) : [],
    };
  });
  const loopedBowls = [...bowls, ...bowls, ...bowls];
  const trackRef = useRef<HTMLDivElement>(null);
  const sampleCardRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(bowls.length);
  const [stepSize, setStepSize] = useState(512);
  const [isTransitionEnabled, setIsTransitionEnabled] = useState(true);

  const eyebrowClass = tone === "dark" ? "text-white/48" : "text-stone-500";
  const headingClass = tone === "dark" ? "text-white" : "text-stone-900";
  const controlClass =
    tone === "dark"
      ? "border-white/12 text-white hover:border-white hover:bg-white hover:text-stone-950"
      : "border-stone-300 hover:border-stone-900 hover:bg-stone-900 hover:text-white";
  const imageClass =
    tone === "dark" ? "bg-white/6 ring-1 ring-white/8" : "bg-[#f4f1eb]";
  const tagClass =
    tone === "dark"
      ? "border-white/10 text-white/52"
      : "border-stone-200 text-stone-500";
  const descriptionClass = tone === "dark" ? "text-white/68" : "text-stone-500";
  const priceClass = tone === "dark" ? "text-white/42" : "text-stone-400";
  const progressTrackClass = tone === "dark" ? "bg-white/10" : "bg-stone-200";
  const progressFillClass =
    tone === "dark" ? "bg-[var(--lime)]" : "bg-stone-900";

  useEffect(() => {
    const measure = () => {
      const card = sampleCardRef.current;
      const track = trackRef.current;
      if (!card || !track) return;

      const computedStyles = window.getComputedStyle(track);
      const gap = Number.parseFloat(computedStyles.gap || "32");
      setStepSize(card.offsetWidth + gap);
    };

    measure();
    window.addEventListener("resize", measure);

    return () => {
      window.removeEventListener("resize", measure);
    };
  }, []);

  useEffect(() => {
    if (isTransitionEnabled) return;

    const frame = window.requestAnimationFrame(() => {
      setIsTransitionEnabled(true);
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [isTransitionEnabled]);

  const goTo = (direction: "prev" | "next") => {
    setActiveIndex((currentIndex) =>
      direction === "next" ? currentIndex + 1 : currentIndex - 1,
    );
  };

  const autoplay = useEffectEvent(() => {
    goTo("next");
  });

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      autoplay();
    }, 4500);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [autoplay]);

  const handleTransitionEnd = () => {
    const firstLoopIndex = bowls.length;
    const lastLoopIndex = bowls.length * 2 - 1;

    if (activeIndex > lastLoopIndex) {
      setIsTransitionEnabled(false);
      setActiveIndex(firstLoopIndex);
      return;
    }

    if (activeIndex < firstLoopIndex) {
      setIsTransitionEnabled(false);
      setActiveIndex(lastLoopIndex);
    }
  };

  const displayIndex =
    ((activeIndex % bowls.length) + bowls.length) % bowls.length;

  const [selectedBowl, setSelectedBowl] = useState<DishDetails | null>(null);

  if (bowls.length === 0) {
    return null;
  }

  return (
    <div>
      <DishModal
        isOpen={selectedBowl !== null}
        onClose={() => setSelectedBowl(null)}
        bowl={selectedBowl}
      />
      {/* Header */}
      <div className="w-full px-8 md:px-16 lg:px-24 mb-16">
        <div className="mx-auto custom-container flex items-end justify-between">
          <div>
            <p
              className={`mb-4 text-[10px] uppercase tracking-[0.3em] md:text-xs ${eyebrowClass}`}
            >
              Signature Bowls
            </p>
            <h2
              className={`font-serif text-3xl leading-[0.95] md:text-5xl lg:text-5xl ${headingClass}`}
            >
              Our Signature
              <br />
              Dishes
            </h2>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => goTo("prev")}
              className={`flex h-14 w-14 items-center justify-center rounded-md border transition-all duration-300 ${controlClass}`}
              aria-label="Previous bowl"
            >
              <svg
                aria-hidden="true"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => goTo("next")}
              className={`flex h-14 w-14 items-center justify-center rounded-md border transition-all duration-300 ${controlClass}`}
              aria-label="Next bowl"
            >
              <svg
                aria-hidden="true"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Carousel */}
      <div className="overflow-hidden px-8 pb-8 md:px-16 lg:px-24">
        <div
          ref={trackRef}
          className={`flex gap-8 ${
            isTransitionEnabled
              ? "transition-transform duration-500 ease-out"
              : ""
          }`}
          style={{
            transform: `translate3d(-${activeIndex * stepSize}px, 0, 0)`,
          }}
          onTransitionEnd={handleTransitionEnd}
        >
          {loopedBowls.map((bowl, index) => (
            <article
              key={`${bowl.name}-${index}`}
              ref={index === 0 ? sampleCardRef : null}
              className="w-[85vw] shrink-0 sm:w-105 lg:w-96"
            >
              <button
                type="button"
                className="group block w-full cursor-pointer text-left"
                onClick={() => setSelectedBowl(bowl)}
              >
                <div
                  className={`relative mb-8 aspect-square overflow-hidden rounded-sm ${imageClass}`}
                >
                  <Image
                    src={bowl.image}
                    alt={bowl.name}
                    fill
                    sizes="(max-width: 640px) 85vw, (max-width: 1024px) 420px, 480px"
                    className="object-contain p-16 transition-transform duration-700 group-hover:scale-105"
                  />
                </div>

                <div className="mb-4 flex flex-wrap gap-2">
                  {bowl.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`border px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] ${tagClass}`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mb-4">
                  <h3
                    className={`font-serif text-2xl md:text-3xl ${headingClass}`}
                  >
                    {bowl.name}
                  </h3>
                </div>

                <p
                  className={`max-w-md text-sm leading-relaxed md:text-base ${descriptionClass}`}
                >
                  {bowl.description}
                </p>
              </button>
            </article>
          ))}
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full px-8 md:px-16 lg:px-24 mt-4">
        <div className="mx-auto custom-container">
          <div className={`relative h-px ${progressTrackClass}`}>
            <div
              className={`absolute left-0 top-0 h-px transition-all duration-500 ${progressFillClass}`}
              style={{ width: `${((displayIndex + 1) / bowls.length) * 100}%` }}
            />
          </div>
          <div className="flex justify-between mt-3">
            <span
              className={`font-mono text-[10px] tracking-widest ${priceClass}`}
            >
              Previous
            </span>
            <span
              className={`font-mono text-[10px] tracking-widest ${priceClass}`}
            >
              Next
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
