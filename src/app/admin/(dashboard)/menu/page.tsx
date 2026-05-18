import { asc, sql } from "drizzle-orm";
import { Suspense } from "react";
import { db } from "@/db";
import { menuCategories, menuItems } from "@/db/schema";
import { MenuManager } from "./menu-manager";

type MenuItemRow = {
  id: number;
  categoryId: number;
  name: string;
  price: string;
  image: string | null;
  displayOrder: number;
};

async function MenuPageContent() {
  const categories = await db
    .select()
    .from(menuCategories)
    .orderBy(asc(menuCategories.displayOrder));
  let items: MenuItemRow[];

  try {
    items = await db
      .select()
      .from(menuItems)
      .orderBy(asc(menuItems.displayOrder));
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const causeMessage =
      error instanceof Error &&
      error.cause &&
      typeof error.cause === "object" &&
      "message" in error.cause &&
      typeof error.cause.message === "string"
        ? error.cause.message
        : "";
    const combinedMessage = `${errorMessage} ${causeMessage}`;

    if (!combinedMessage.includes("no such column: image")) {
      throw error;
    }

    const legacyItems = await db
      .select({
        id: sql<number>`id`,
        categoryId: sql<number>`category_id`,
        name: sql<string>`name`,
        price: sql<string>`price`,
        displayOrder: sql<number>`display_order`,
      })
      .from(sql`menu_items`)
      .orderBy(sql`display_order asc`);

    items = legacyItems.map((item) => ({
      ...item,
      image: null,
    }));
  }

  const categoriesWithItems = categories.map((cat) => ({
    ...cat,
    items: items.filter((item) => item.categoryId === cat.id),
  }));

  return <MenuManager categoriesWithItems={categoriesWithItems} />;
}

function MenuPageFallback() {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-6 text-sm text-stone-500 shadow-sm">
      Loading menu management...
    </div>
  );
}

export default function MenuPage() {
  return (
    <div className="space-y-8">
      <div>
        <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">
          Admin
        </p>
        <h1 className="text-3xl font-serif text-stone-900">Menu Management</h1>
        <p className="mt-1 text-sm text-stone-500">
          Add, edit, or remove menu categories and individual items.
        </p>
      </div>

      <Suspense fallback={<MenuPageFallback />}>
        <MenuPageContent />
      </Suspense>
    </div>
  );
}
