import type { Metadata } from "next";
import "./globals.css";
import { RootLayoutBody } from "@/components/app/root-layout-body";

export const metadata: Metadata = {
  title: "Fresh Fuel Poke",
  description:
    "Fresh Fuel Poke landing page with signature bowls, catering highlights, and vibrant ingredient-driven design.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png",
  },
};

import { getRestaurantInfo } from "@/lib/data";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const restaurantInfo = await getRestaurantInfo();

  return (
    <html lang="en" className="h-full antialiased">
      <RootLayoutBody restaurantInfo={restaurantInfo}>
        {children}
      </RootLayoutBody>
    </html>
  );
}
