import Image from "next/image";
import { ContactForm } from "@/components/restaurant/contact-form";
import { Reveal } from "@/components/restaurant/reveal";
import { SiteHeader } from "@/components/restaurant/site-header";
import { getMenuCategories, getRestaurantInfo } from "@/lib/data";

export default async function ContactPage() {
  const [menuCategories, restaurantInfo] = await Promise.all([
    getMenuCategories(),
    getRestaurantInfo(),
  ]);

  return (
    <main className="min-h-screen bg-white text-[#121212]">
      <SiteHeader menuCategories={menuCategories} logo={restaurantInfo.logo} />

      <section className="relative pt-48 pb-24 px-8 md:px-16 lg:px-24 overflow-hidden">
        <Image
          src="https://utfs.io/f/f5g7m1aw2QJCdImS4sUXQ2g4zFsNfvVYqxiHanuLb8ZTktmB"
          alt="Fresh Fuel Poke restaurant"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
        <div className="relative mx-auto custom-container">
          <Reveal delay={80}>
            <h1 className="font-serif text-5xl md:text-7xl mb-6 text-white">Contact Us</h1>
            <p className="text-lg text-stone-200 max-w-2xl leading-relaxed">
              Have a question about our menu, catering, or just want to say hi? 
              We'd love to hear from you. Reach out through any of the channels below.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="px-6 py-16 md:px-12 md:py-24 lg:px-24">
        <Reveal className="mx-auto max-w-4xl" delay={80}>

          {/* Form Block */}
          <div className="bg-[#f9faf9] p-8 md:p-12 lg:px-16 lg:py-14">
            <ContactForm />
          </div>

          {/* Contact Details Footer */}
          <div className="mt-16 flex flex-col sm:flex-row justify-start gap-12 sm:gap-24 lg:gap-32 px-4 md:px-8">
            {/* Location */}
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f4f5f1] text-stone-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
              </div>
              <div>
                <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">Location</p>
                <p className="text-sm font-medium leading-relaxed tracking-wide text-stone-800 whitespace-pre-line">
                  {restaurantInfo?.addressLine || "G/F, 19 Amoy Street\nWanchai, Hong Kong"}
                </p>
              </div>
            </div>

            {/* Contact */}
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f4f5f1] text-stone-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
              </div>
              <div>
                <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">Contact</p>
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

        </Reveal>
      </section>
    </main>
  );
}
