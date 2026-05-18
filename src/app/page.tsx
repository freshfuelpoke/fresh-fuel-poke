import Image from "next/image";
import { BowlCarousel } from "@/components/design5/bowl-carousel";
import { HeroCarousel } from "@/components/restaurant/hero-carousel";
import { Reveal } from "@/components/restaurant/reveal";
import { SiteHeader } from "@/components/restaurant/site-header";
import { storyCardDefaults } from "@/components/restaurant/story-card-defaults";
import { WhatWeServe } from "@/components/restaurant/what-we-serve";
import {
  getHeroSlides,
  getHours,
  getMenuCategories,
  getRestaurantInfo,
} from "@/lib/data";

type FloatingHighlight = {
  imageKey: "storyImage1" | "storyImage2" | "storyImage3";
  titleKey: "storyImage1Title" | "storyImage2Title" | "storyImage3Title";
  descriptionKey:
    | "storyImage1Description"
    | "storyImage2Description"
    | "storyImage3Description";
  size: "small" | "medium" | "large";
  position?: string;
};

const floatingHighlights: readonly FloatingHighlight[] = [
  {
    imageKey: "storyImage1",
    titleKey: "storyImage1Title",
    descriptionKey: "storyImage1Description",
    size: storyCardDefaults.storyImage1.size,
    position: storyCardDefaults.storyImage1.position,
  },
  {
    imageKey: "storyImage2",
    titleKey: "storyImage2Title",
    descriptionKey: "storyImage2Description",
    size: storyCardDefaults.storyImage2.size,
  },
  {
    imageKey: "storyImage3",
    titleKey: "storyImage3Title",
    descriptionKey: "storyImage3Description",
    size: storyCardDefaults.storyImage3.size,
  },
];

export default async function HomePage() {
  const [hours, heroSlides, menuCategories, restaurantInfo] = await Promise.all(
    [getHours(), getHeroSlides(), getMenuCategories(), getRestaurantInfo()],
  );
  const signatureBowls =
    menuCategories.find((category) => category.title === "Signature Bowls")
      ?.items ?? [];

  return (
    <main className="bg-white text-[#121212]">
      <SiteHeader menuCategories={menuCategories} logo={restaurantInfo.logo} />

      <HeroCarousel
        slides={heroSlides}
        eyebrow="Bold & Trendy"
        title={["Bowls", "Built"]}
        accent="for the feed."
        description="Freshly prepared poke bowls, vibrant toppings, and feel-good meals made for lunch runs, dinner cravings, and easy group orders."
      />

      <section className="px-8 py-16 md:px-16 md:py-20 lg:px-24 lg:py-24">
        <Reveal delay={80}>
          <div className="mx-auto custom-container bg-white px-0 py-0 text-[#121212] md:px-10 md:py-12 lg:rounded-lg lg:border lg:border-stone-200 lg:px-10 lg:py-12 lg:shadow-[0_28px_80px_rgba(15,23,42,0.08)]">
            <div className="grid gap-10 lg:grid-cols-[0.62fr_1.38fr] lg:items-center">
              <div className="max-w-xl py-2 md:px-0 md:py-0 lg:pb-10">
                <h2 className="mt-4 font-serif text-4xl leading-[0.94] tracking-[-0.03em] text-stone-950 md:text-5xl">
                  Our Story
                </h2>
                <p className="mt-6 max-w-lg text-sm leading-8 tracking-[0.08em] text-stone-600 md:text-base">
                  {restaurantInfo?.story ??
                    "Fresh Fuel Poke was born from a simple idea that fast food does not have to be junk food."}
                </p>
              </div>

              <div className="hidden rounded-lg border border-stone-200 bg-[#f4f5f1] p-4 sm:p-6 lg:block">
                <div className="relative hidden min-h-180 overflow-hidden lg:block">
                  <div className="pointer-events-none absolute inset-x-0 top-8 text-center text-[5rem] font-black uppercase leading-none tracking-[0.32em] text-stone-900/4 lg:text-[6.5rem]">
                    Fresh Fuel
                  </div>
                  <div className="pulse-halo absolute left-[6%] top-[8%] h-44 w-44 rounded-full bg-(--brand-red)/20 blur-3xl" />
                  <div className="pulse-halo absolute bottom-[12%] right-[8%] h-52 w-52 rounded-full bg-(--lime)/18 blur-3xl" />

                  {floatingHighlights.map((item, index) => {
                    const title = restaurantInfo?.[item.titleKey];
                    const description = restaurantInfo?.[item.descriptionKey];
                    const image = restaurantInfo?.[item.imageKey];

                    // Only render if we have at least a title or an image
                    if (!title && !image) return null;

                    return (
                      <article
                        key={item.imageKey}
                        className={`absolute rounded-lg border border-stone-200 bg-white p-4 text-[#121212] shadow-[0_30px_70px_rgba(15,23,42,0.12)] transition duration-500 hover:-translate-y-2 ${
                          index === 0
                            ? "floating-soft left-[3%] top-[12%] w-[34%] max-w-62.5 rotate-[-5deg]"
                            : index === 1
                              ? "floating-medium left-1/2 top-[16%] z-10 w-[44%] max-w-90 -translate-x-1/2"
                              : "floating-slow right-[3%] bottom-[8%] w-[35%] max-w-65 rotate-[5deg]"
                        }`}
                      >
                        <div
                          className={`relative overflow-hidden rounded-md bg-[#f5f4ef] ${
                            item.size === "large"
                              ? "aspect-square"
                              : "aspect-4/5"
                          }`}
                        >
                          <Image
                            src={
                              image || storyCardDefaults[item.imageKey].image
                            }
                            alt={title || ""}
                            fill
                            sizes="(max-width: 1024px) 100vw, 28vw"
                            className="object-cover transition duration-500 hover:scale-105"
                            style={{
                              objectPosition: item.position || "center",
                            }}
                          />
                        </div>
                        {title && (
                          <div className="mt-4">
                            <h3 className="font-serif text-2xl text-stone-950">
                              {title}
                            </h3>
                          </div>
                        )}
                        {description && (
                          <p className="mt-3 text-sm leading-7 tracking-[0.06em] text-stone-500">
                            {description}
                          </p>
                        )}
                      </article>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="border-t border-stone-200 py-20 md:py-28">
        <Reveal delay={80}>
          <BowlCarousel items={signatureBowls} />
        </Reveal>
      </section>

      <section id="menu-section" className="what-we-serve-section">
        <Reveal delay={80}>
          <WhatWeServe menuCategories={menuCategories} />
        </Reveal>
      </section>

      <section className="px-8 py-24 md:px-16 md:py-40 lg:px-24">
        <Reveal
          className="mx-auto grid custom-container gap-16 lg:grid-cols-2 lg:gap-24"
          delay={80}
        >
          <div>
            <p className="mb-8 text-[10px] font-medium uppercase tracking-[0.3em] text-stone-400 md:text-xs">
              Visit
            </p>
            <h2 className="mb-8 font-serif text-3xl leading-tight text-stone-900 md:text-4xl">
              Hours &<br />
              Location
            </h2>
            {restaurantInfo?.location && (
              <p className="mb-12 max-w-md text-sm leading-relaxed tracking-wide text-stone-500 md:text-base">
                {restaurantInfo.location}
              </p>
            )}

            <div className="space-y-4">
              {hours.map((hour) => (
                <div
                  key={`${hour.label}-${hour.value}`}
                  className="flex items-baseline justify-between border-b border-stone-200 pb-4"
                >
                  <span className="text-xs font-medium uppercase tracking-[0.2em] text-stone-500">
                    {hour.label}
                  </span>
                  <span className="text-sm font-medium tracking-wide text-stone-900">
                    {hour.value}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              <div className="flex items-start gap-4 rounded-lg border border-stone-200 bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.04)] transition-transform duration-300 hover:-translate-y-1">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f4f5f1] text-stone-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <div>
                  <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">
                    Location
                  </p>
                  <p className="text-sm font-medium leading-relaxed tracking-wide text-stone-800">
                    {restaurantInfo?.addressLine}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-lg border border-stone-200 bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.04)] transition-transform duration-300 hover:-translate-y-1">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f4f5f1] text-stone-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </div>
                <div>
                  <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">
                    Contact
                  </p>
                  <div className="text-sm font-medium leading-relaxed tracking-wide text-stone-800">
                    {restaurantInfo?.phone && (
                      <p>
                        Tel:{" "}
                        <a
                          href={`tel:${restaurantInfo.phone}`}
                          className="hover:text-stone-950 hover:underline transition-colors"
                        >
                          {restaurantInfo.phone}
                        </a>
                      </p>
                    )}
                    {restaurantInfo?.whatsApp && (
                      <p>
                        WhatsApp:{" "}
                        <a
                          href={`https://wa.me/${restaurantInfo.whatsApp.replace(/[^\d]/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-stone-950 hover:underline transition-colors"
                        >
                          {restaurantInfo.whatsApp}
                        </a>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative h-full min-h-[400px] lg:min-h-[500px]">
            <div className="relative h-full w-full overflow-hidden rounded-xl bg-stone-100 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
              <iframe
                title="Fresh Fuel Poke Location Map"
                width="100%"
                height="100%"
                className="absolute inset-0 border-0"
                src="https://maps.google.com/maps?width=100%25&amp;height=100%25&amp;hl=en&amp;q=19%20Amoy%20Street,%20Wanchai,%20Hong%20Kong&amp;t=&amp;z=15&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
