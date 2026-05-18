"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/admin", label: "Dashboard Home" },
  { href: "/admin/menu", label: "Manage Menu" },
  { href: "/admin/slides", label: "Manage Slides" },
  { href: "/admin/restaurant-pages", label: "Restaurant Pages" },
  { href: "/admin/users", label: "Manage Users" },
] as const;

export function AdminSidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="flex-1 p-4 space-y-2">
      {navItems.map((item) => {
        const isActive =
          item.href === "/admin"
            ? pathname === "/admin"
            : pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`block rounded-md border px-4 py-2 transition-colors ${
              isActive
                ? "border-stone-700 bg-stone-800 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]"
                : "border-transparent text-stone-300 hover:bg-stone-800 hover:text-white"
            }`}
            aria-current={isActive ? "page" : undefined}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
