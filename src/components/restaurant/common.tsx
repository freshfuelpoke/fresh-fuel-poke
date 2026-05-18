import Image from "next/image";
import { hours, restaurantInfo, testimonials } from "./content";

export function RestaurantLogo({
  className = "",
  priority = false,
  src,
  alt = `${restaurantInfo.name} logo`,
}: {
  className?: string;
  priority?: boolean;
  src: string;
  alt?: string;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      width={610}
      height={294}
      preload={priority}
      className={className}
    />
  );
}

export function ActionButtons({
  primaryClassName = "",
  secondaryClassName = "",
}: {
  primaryClassName?: string;
  secondaryClassName?: string;
}) {
  return (
    <div className="flex flex-wrap gap-4">
      <button type="button" className={primaryClassName}>
        {restaurantInfo.ctaPrimary}
      </button>
      <button type="button" className={secondaryClassName}>
        {restaurantInfo.ctaSecondary}
      </button>
    </div>
  );
}

export function HoursLocationPanel({
  className = "",
  tone = "light",
}: {
  className?: string;
  tone?: "light" | "dark";
}) {
  const titleClass = tone === "dark" ? "text-white" : "text-stone-950";
  const bodyClass = tone === "dark" ? "text-white/78" : "text-stone-700";
  const borderClass = tone === "dark" ? "border-white/14" : "border-stone-200";

  return (
    <section className={className}>
      <div className={`rounded-lg border ${borderClass} p-6 sm:p-8`}>
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p
              className={`text-xs font-semibold uppercase tracking-[0.28em] ${bodyClass}`}
            >
              Hours & Location
            </p>
            <h3
              className={`mt-3 font-[family-name:var(--font-display)] text-3xl tracking-[-0.03em] ${titleClass}`}
            >
              Visit for dine-in, order in for easy nights, or book ahead for
              groups.
            </h3>
            <p className={`mt-4 max-w-lg text-base leading-8 ${bodyClass}`}>
              {restaurantInfo.location}
              <br />
              {restaurantInfo.addressLine}
            </p>
          </div>
          <div className="space-y-3">
            {hours.map((slot) => (
              <div
                key={slot.label}
                className={`flex items-center justify-between rounded-md border ${borderClass} px-4 py-3`}
              >
                <span
                  className={`text-sm font-semibold uppercase tracking-[0.16em] ${bodyClass}`}
                >
                  {slot.label}
                </span>
                <span className={`text-sm font-medium ${titleClass}`}>
                  {slot.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function TestimonialGrid({
  className = "",
  cardClassName = "",
  textTone = "light",
}: {
  className?: string;
  cardClassName?: string;
  textTone?: "light" | "dark";
}) {
  const quoteClass = textTone === "dark" ? "text-white" : "text-stone-950";
  const metaClass = textTone === "dark" ? "text-white/68" : "text-stone-600";

  return (
    <section className={className}>
      <div className="grid gap-5 lg:grid-cols-3">
        {testimonials.map((item) => (
          <article key={item.name} className={cardClassName}>
            <p className={`text-lg leading-8 ${quoteClass}`}>
              &ldquo;{item.quote}&rdquo;
            </p>
            <p
              className={`mt-6 text-sm font-semibold uppercase tracking-[0.18em] ${metaClass}`}
            >
              {item.name}
            </p>
            <p className={`mt-2 text-sm ${metaClass}`}>{item.context}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function RestaurantFooter({
  variant = "casual",
}: {
  variant?: "casual" | "bold" | "premium";
}) {
  const wrapperClass =
    variant === "bold"
      ? "bg-stone-950 text-white"
      : variant === "premium"
        ? "border-t border-stone-200 bg-[#faf6ee] text-stone-900"
        : "bg-[var(--lime)] text-white";

  const mutedClass =
    variant === "bold"
      ? "text-white/90"
      : variant === "premium"
        ? "text-stone-700"
        : "text-white/95";

  const borderClass =
    variant === "premium" ? "border-stone-900/20" : "border-white/90";

  const iconHoverClass =
    variant === "premium" ? "hover:bg-stone-900/5" : "hover:bg-white/10";

  return (
    <footer className={`${wrapperClass} px-5 py-10 sm:px-8 lg:px-10`}>
      <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-3 md:items-end">
        <div className="flex flex-col items-start gap-4 md:justify-self-start">
          <p
            className={`text-sm font-semibold uppercase tracking-[0.24em] ${mutedClass}`}
          >
            Follow Us
          </p>
          <button
            type="button"
            aria-label="Instagram"
            className={`flex h-14 w-14 items-center justify-center rounded-md border-2 ${borderClass} bg-transparent transition ${iconHoverClass}`}
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-8 w-8"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.9"
            >
              <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
              <circle cx="12" cy="12" r="4.1" />
              <circle
                cx="17.4"
                cy="6.7"
                r="1"
                fill="currentColor"
                stroke="none"
              />
            </svg>
          </button>
        </div>

        <div className="md:justify-self-center md:self-end">
          <p
            className={`text-center text-sm font-semibold tracking-[0.18em] ${mutedClass}`}
          >
            © Copyright Freshfuelpoke 2026
          </p>
        </div>

        <div className="flex flex-col items-start gap-4 md:items-end md:justify-self-end">
          <p
            className={`text-sm font-semibold uppercase tracking-[0.24em] ${mutedClass}`}
          >
            Delivery Service By
          </p>
          <div className="flex items-center gap-4">
            <Image
              src="https://utfs.io/f/f5g7m1aw2QJCEnD37sPXnrovSTHNymhD2U3OM0ksgPKYRwlB"
              alt="foodpanda"
              width={92}
              height={65}
              sizes="92px"
              className="h-auto w-[84px]"
            />
            <Image
              src="https://utfs.io/f/f5g7m1aw2QJCGapltUJeouZfvdKUhQx2l10R6w8973BCEmXT"
              alt="Keeta"
              width={52}
              height={52}
              sizes="52px"
              className="h-auto w-11 rounded-md"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
