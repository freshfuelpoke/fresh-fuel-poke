import Image from "next/image";
import Link from "next/link";
import { RestaurantLogo } from "./common";
import { Reveal } from "./reveal";

const footerLinks = [
  { label: "Home", href: "/" },
  { label: "Dine-in & Delivery", href: "/dine-in-delivery" },
  { label: "Catering", href: "/catering" },
  { label: "Contact Us", href: "/contact" },
] as const;

const deliveryPlatforms = [
  {
    label: "Delivery Platform",
    src: "https://utfs.io/f/f5g7m1aw2QJCFHL7oUjifOUmqvT9308MN2xIjA14sKEcJLZk",
    width: 140,
    height: 42,
    className: "w-[126px] md:w-[140px]",
  },
] as const;

type FooterRestaurantInfo = {
  logo: string;
  instagram?: string;
  facebook?: string;
};

export function SiteFooter({
  restaurantInfo,
}: {
  restaurantInfo: FooterRestaurantInfo;
}) {
  const dynamicSocialLinks = [
    {
      label: "Instagram",
      href: restaurantInfo?.instagram || "",
      src: "https://utfs.io/f/f5g7m1aw2QJC5RZDFczeyYWf6m0OvIax7QAGc5tUgrqRh3w1",
      width: 60,
      height: 60,
      className: "w-10 md:w-11",
    },
    {
      label: "Facebook",
      href: restaurantInfo?.facebook || "",
      src: "https://utfs.io/f/f5g7m1aw2QJC5hwIbzeyYWf6m0OvIax7QAGc5tUgrqRh3w1J",
      width: 60,
      height: 60,
      className: "w-10 md:w-11",
    },
  ];

  return (
    <footer className="bg-[#111922] px-8 pb-7 pt-8 text-white md:px-16 md:pt-10 lg:px-24 lg:pt-9">
      <Reveal className="mx-auto custom-container" delay={80}>
        <div className="grid gap-10 md:grid-cols-2 md:items-start lg:grid-cols-[0.85fr_0.9fr_0.95fr_1fr] lg:gap-14">
          <nav aria-label="Footer" className="pt-1">
            <ul className="space-y-5">
              {footerLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-[1.05rem] font-semibold leading-none text-white underline decoration-white/90 underline-offset-[3px] transition hover:text-white/80"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:justify-self-start lg:pt-6">
            <Link href="/" aria-label="Fresh Fuel Poke home">
              <RestaurantLogo
                src={restaurantInfo.logo}
                alt="Fresh Fuel Poke logo"
                className="w-[138px] md:w-[170px]"
              />
            </Link>
          </div>

          <div className="text-center lg:pt-2">
            <p className="text-[1.05rem] font-semibold text-white">
              Follow Us on
            </p>
            <div className="mt-4 flex items-center justify-center gap-1 ml-2">
              {dynamicSocialLinks.map((item) => {
                const icon = (
                  <Image
                    src={item.src}
                    alt={item.label}
                    width={item.width}
                    height={item.height}
                    className={item.className}
                    style={{ height: "auto" }}
                  />
                );

                if (!item.href) {
                  return (
                    <div
                      key={item.label}
                      className="opacity-40 grayscale cursor-not-allowed"
                    >
                      {icon}
                    </div>
                  );
                }

                return (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={item.label}
                    className="transition opacity-90 hover:opacity-100"
                  >
                    {icon}
                  </a>
                );
              })}
            </div>
          </div>

          <div className="text-center lg:justify-self-end lg:pt-2">
            <p className="text-[1.05rem] font-semibold text-white">
              Delivery Platform
            </p>
            <div className="mt-4 flex items-center justify-center gap-5">
              {deliveryPlatforms.map((item) => (
                <Image
                  key={item.label}
                  src={item.src}
                  alt={item.label}
                  width={item.width}
                  height={item.height}
                  className={item.className}
                  style={{ height: "auto" }}
                />
              ))}
            </div>
          </div>
        </div>

        <p className="mt-12 text-center text-[0.95rem] font-semibold uppercase tracking-[0.01em] text-white md:mt-10">
          &copy; COPYRIGHT FRESHFUELPOKE 2026
        </p>
      </Reveal>
    </footer>
  );
}
