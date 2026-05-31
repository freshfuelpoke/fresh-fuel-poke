"use client";

import Image from "next/image";
import { startTransition, useEffect, useEffectEvent, useState } from "react";

type HeroSlide = {
  src: string;
  alt: string;
  label?: string | null;
  title?: readonly string[];
  accent?: string | null;
  description?: string;
};

export function HeroCarousel({
  slides,
  eyebrow,
  title,
  accent,
  description,
}: {
  slides: readonly HeroSlide[];
  eyebrow: string;
  title: readonly string[];
  accent: string;
  description: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);

  const setSlide = (index: number) => {
    startTransition(() => {
      setActiveIndex(index);
    });
  };

  const goToNext = useEffectEvent(() => {
    setSlide((activeIndex + 1) % slides.length);
  });

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      goToNext();
    }, 5000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [goToNext]);

  const currentSlide = slides[activeIndex];
  const activeTitle = currentSlide?.title ?? title;
  const activeAccent = currentSlide?.accent ?? accent;
  const activeDescription = currentSlide?.description ?? description;

  return (
    <section className="relative flex min-h-screen flex-col justify-end overflow-hidden bg-black">
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <div
            key={slide.src}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === activeIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              priority={index === 0}
              sizes="100vw"
              className={`object-cover transition-transform duration-[8000ms] ease-out ${
                index === activeIndex ? "scale-105" : "scale-100"
              }`}
            />
          </div>
        ))}
      </div>

      <div className="relative z-10 w-full px-8 pb-10 md:px-12 md:pb-16 lg:px-12">
        <div className="mx-auto flex w-full flex-col items-center justify-center gap-8 md:flex-row md:items-end md:gap-0">
          {/* Main Layout Layer (Desktop) */}
          <div className="hidden w-full md:flex md:items-end">
            {/* Left Side: Content (Stretches to center) */}
            <div className="flex-1">
              <div className="rounded-lg bg-black/30 px-10 py-8 lg:px-14 lg:py-10 mr-2 lg:mr-6">
                {slides.map((slide, index) => {
                  const slideTitle = slide.title ?? title;
                  const slideAccent = slide.accent ?? accent;

                  return (
                    <div
                      key={`text-desktop-${slide.src}`}
                      className={`col-start-1 row-start-1 transform-gpu transition-all duration-1000 ease-out will-change-[opacity,transform] ${
                        index === activeIndex
                          ? "translate-y-0 opacity-100"
                          : "absolute inset-0 pointer-events-none translate-y-8 opacity-0"
                      }`}
                    >
                      <h1 className="text-white text-left">
                        <span
                          className="block font-black uppercase leading-[0.86] tracking-[-0.05em]"
                          style={{ fontSize: "clamp(2rem, 4.5vw, 7.5rem)" }}
                        >
                          {slideTitle.join(" ")}
                        </span>
                        <span
                          className="mt-1 block font-serif italic font-light leading-[1.2] tracking-normal text-white/95"
                          style={{ fontSize: "clamp(1.1rem, 2.2vw, 3.8rem)" }}
                        >
                          {slideAccent}
                        </span>
                      </h1>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Center: Dots (Shrink-to-fit) */}
            <div className="flex shrink-0 items-center justify-center pb-10 lg:pb-14">
              <div className="flex items-center gap-3">
                {slides.map((slide, index) => (
                  <button
                    key={`dot-desktop-${slide.src}`}
                    type="button"
                    onClick={() => setSlide(index)}
                    aria-label={`Show slide ${index + 1}`}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      index === activeIndex
                        ? "w-10 bg-white"
                        : "w-4 bg-white/30 hover:bg-white/60"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Right Side: Empty Spacer (Keeps dots centered) */}
            <div className="flex-1 hidden md:block" />
          </div>

          {/* Mobile Layout (Stacked Centered) */}
          <div className="flex flex-col items-center gap-8 md:hidden">
            <div className="rounded-lg bg-black/30 px-6 py-5 backdrop-blur-sm">
              {slides.map((slide, index) => {
                const slideTitle = slide.title ?? title;
                const slideAccent = slide.accent ?? accent;

                return (
                  <div
                    key={`text-mobile-${slide.src}`}
                    className={`col-start-1 row-start-1 transform-gpu transition-all duration-1000 ease-out will-change-[opacity,transform] ${
                      index === activeIndex
                        ? "translate-y-0 opacity-100"
                        : "absolute inset-0 pointer-events-none translate-y-8 opacity-0"
                    }`}
                  >
                    <h1 className="text-white text-center">
                      <span className="block text-3xl font-black uppercase leading-[0.86] tracking-[-0.05em]">
                        {slideTitle.join(" ")}
                      </span>
                      <span className="mt-1 block font-serif text-lg italic font-light leading-[1.2] text-white/95">
                        {slideAccent}
                      </span>
                    </h1>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center gap-2">
              {slides.map((slide, index) => (
                <button
                  key={`dot-mobile-${slide.src}`}
                  type="button"
                  onClick={() => setSlide(index)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    index === activeIndex ? "w-8 bg-white" : "w-4 bg-white/30"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
