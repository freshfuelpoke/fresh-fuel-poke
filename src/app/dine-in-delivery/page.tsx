import Image from "next/image";
import { Reveal } from "@/components/restaurant/reveal";
import { SiteHeader } from "@/components/restaurant/site-header";

import { getMenuCategories, getRestaurantInfo, getHours } from "@/lib/data";

export default async function DineInDeliveryPage() {
  const [menuCategories, restaurantInfo, hours] = await Promise.all([
    getMenuCategories(true),
    getRestaurantInfo(),
    getHours(),
  ]);

  // Find specific hours if they exist, otherwise use first/second as fallback or empty
  const dineInHours =
    hours.find((h) => h.label.toLowerCase().includes("dine"))?.value ||
    (hours.length > 0 ? hours[0].value : "");
  const takeAwayHours =
    hours.find((h) => h.label.toLowerCase().includes("take"))?.value ||
    (hours.length > 1
      ? hours[1].value
      : hours.length > 0
        ? hours[0].value
        : "");

  return (
    <main className="bg-white text-[#121212]">
      <SiteHeader menuCategories={menuCategories} logo={restaurantInfo.logo} />

      <section className="relative h-[35vh] min-h-[300px] w-full overflow-hidden">
        <Image
          src="https://utfs.io/f/f5g7m1aw2QJC4xasctZqz0Tn1UrOHSPCtlMQ5p7iI9ogvEZu"
          alt="Fresh Fuel Poke restaurant"
          fill
          className="object-cover"
          priority
        />
      </section>

      <section className="px-6 py-12 md:px-12 md:py-16 lg:px-24 overflow-hidden">
        <Reveal className="mx-auto custom-container max-w-6xl" delay={80}>
          <div>
            <h1 className="font-serif text-3xl md:text-4xl mb-6 text-[#1a1a1a] tracking-tight">
              Dine-in & Delivery
            </h1>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            {/* Left Column: Content Section */}
            <div className="order-2 lg:order-1">
              <div className="space-y-12">
                {restaurantInfo?.serviceHeaderDescription && (
                  <p className="text-[15px] text-stone-600 max-w-4xl leading-relaxed font-light whitespace-pre-line">
                    {restaurantInfo.serviceHeaderDescription}
                  </p>
                )}
                <div className="relative">
                  <div className="flex items-end justify-between mb-3">
                    <h3 className="font-serif text-2xl text-stone-500">
                      Dine-In
                    </h3>
                    <div className="flex flex-col items-end">
                      <div className="flex items-center gap-1.5">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-[var(--lime)]"
                        >
                          <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"></path>
                          <path d="M7 2v20"></path>
                          <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"></path>
                        </svg>
                        <span className="text-sm font-semibold text-stone-900">
                          Dine In
                        </span>
                      </div>
                      <span className="text-stone-400 text-xs mt-0.5">
                        {dineInHours}
                      </span>
                    </div>
                  </div>
                  <div className="h-[2px] w-full bg-stone-200 mb-6"></div>

                  <div className="space-y-6">
                    <h4 className="text-stone-500 font-medium text-sm tracking-wide">
                      Dine-in Service
                    </h4>
                    {restaurantInfo?.serviceDineInDescription && (
                      <div className="space-y-4 text-stone-500 text-[15px] leading-relaxed whitespace-pre-line">
                        <p>{restaurantInfo.serviceDineInDescription}</p>
                      </div>
                    )}
                    <div className="space-y-1.5 pt-2">
                      {restaurantInfo?.phone && (
                        <p className="text-stone-500 text-sm">
                          <span className="font-light">Direct line:</span>{" "}
                          <a
                            href={`tel:${restaurantInfo.phone}`}
                            className="hover:text-stone-800 transition-colors"
                          >
                            {restaurantInfo.phone}
                          </a>
                        </p>
                      )}
                      {restaurantInfo?.whatsApp && (
                        <p className="text-stone-500 text-sm">
                          <span className="font-light">Whatsapp:</span>{" "}
                          <a
                            href={`https://wa.me/${restaurantInfo.whatsApp.replace(/[^\d]/g, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-stone-800 transition-colors"
                          >
                            {restaurantInfo.whatsApp}
                          </a>
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Take Away Block */}
                <div className="relative">
                  <div className="flex items-end justify-between mb-3">
                    <h3 className="font-serif text-2xl text-stone-500">
                      Take Away
                    </h3>
                    <div className="flex flex-col items-end">
                      <div className="flex items-center gap-1.5">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-[var(--brand-red)]"
                        >
                          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                          <line x1="3" y1="6" x2="21" y2="6"></line>
                          <path d="M16 10a4 4 0 0 1-8 0"></path>
                        </svg>
                        <span className="text-sm font-semibold text-stone-900">
                          Take Away
                        </span>
                      </div>
                      <span className="text-stone-400 text-xs mt-0.5">
                        {takeAwayHours}
                      </span>
                    </div>
                  </div>
                  <div className="h-[2px] w-full bg-stone-200 mb-6"></div>

                  <div className="space-y-6">
                    {restaurantInfo?.serviceTakeAwayDescription && (
                      <div className="text-stone-500 text-[15px] leading-relaxed whitespace-pre-line">
                        <p>{restaurantInfo.serviceTakeAwayDescription}</p>
                      </div>
                    )}
                    <div className="space-y-1.5 pt-2">
                      {restaurantInfo?.phone && (
                        <p className="text-stone-500 text-sm">
                          <span className="font-light">Direct line:</span>{" "}
                          <a
                            href={`tel:${restaurantInfo.phone}`}
                            className="hover:text-stone-800 transition-colors"
                          >
                            {restaurantInfo.phone}
                          </a>
                        </p>
                      )}
                      {restaurantInfo?.whatsApp && (
                        <p className="text-stone-500 text-sm">
                          <span className="font-light">Whatsapp:</span>{" "}
                          <a
                            href={`https://wa.me/${restaurantInfo.whatsApp.replace(/[^\d]/g, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-stone-800 transition-colors"
                          >
                            {restaurantInfo.whatsApp}
                          </a>
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Delivery Section */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-start gap-6">
                  <p className="text-[13px] text-stone-500 text-left">
                    For delivery service please proceed to our delivery platform
                  </p>
                  <div className="flex items-center shrink-0">
                    <Image
                      src="https://utfs.io/f/f5g7m1aw2QJCW8UvOYdUcmkRCaTr3jIxG0gXzbf1P54hJsYL"
                      alt="Delivery Platforms"
                      width={140}
                      height={40}
                      className="object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Picture Section */}
            <div className="relative order-1 lg:order-2">
              <div className="relative">
                {/* Main Image with Symmetric Visible Shadow, Border & Sharp Corners */}
                {restaurantInfo?.serviceImage2 && (
                  <div className="relative aspect-[4/5] w-[90%] overflow-hidden rounded-lg border-[6px] border-white shadow-[0_0_60px_rgba(0,0,0,0.3)]">
                    <Image
                      src={restaurantInfo.serviceImage2}
                      alt="Restaurant Interior"
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                )}

                {/* Overlapping Image with Same Symmetric Visible Shadow, Border & Sharp Corners */}
                {restaurantInfo?.serviceImage3 && (
                  <div className="absolute -bottom-8 -right-2 md:-right-4 w-[55%] max-w-[280px] aspect-square rounded-lg overflow-hidden border-[6px] border-white shadow-[0_0_60px_rgba(0,0,0,0.3)] bg-white">
                    <Image
                      src={restaurantInfo.serviceImage3}
                      alt="Food Bowls"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
