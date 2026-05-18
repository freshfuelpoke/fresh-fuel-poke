"use client";

import { usePathname } from "next/navigation";
import { SiteFooter } from "@/components/restaurant/site-footer";

type RootLayoutRestaurantInfo = {
  logo: string;
  instagram?: string;
  facebook?: string;
};

export function RootLayoutBody({
  children,
  restaurantInfo,
}: {
  children: React.ReactNode;
  restaurantInfo: RootLayoutRestaurantInfo;
}) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");

  return (
    <body className="min-h-full flex flex-col font-sans">
      <div className="flex-1">{children}</div>
      {!isAdminRoute && <SiteFooter restaurantInfo={restaurantInfo} />}
    </body>
  );
}
