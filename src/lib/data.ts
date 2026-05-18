import { asc, eq, sql } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { db } from "@/db";
import {
  heroSlides,
  hours,
  menuCategories,
  menuItems,
  restaurantInfo,
  testimonials,
} from "@/db/schema";
import { CACHE_TAGS } from "@/lib/cache";

export async function getRestaurantInfo() {
  "use cache";

  cacheLife("max");
  cacheTag(CACHE_TAGS.restaurantInfo);

  try {
    const result = await db.select().from(restaurantInfo).limit(1);
    if (!result[0]) {
      throw new Error("restaurant_info row is missing.");
    }
    return result[0];
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

    const missingStoryColumn =
      combinedMessage.includes("no such column: story_image_1") ||
      combinedMessage.includes("no such column: story_image_1_title") ||
      combinedMessage.includes("no such column: story_image_1_description") ||
      combinedMessage.includes("no such column: story_image_2") ||
      combinedMessage.includes("no such column: story_image_2_title") ||
      combinedMessage.includes("no such column: story_image_2_description") ||
      combinedMessage.includes("no such column: story_image_3") ||
      combinedMessage.includes("no such column: story_image_3_title") ||
      combinedMessage.includes("no such column: story_image_3_description") ||
      combinedMessage.includes("no such column: logo") ||
      combinedMessage.includes("no such column: contact_email");

    if (!missingStoryColumn) {
      throw error;
    }

    const legacyResult = await db
      .select({
        id: sql<number>`id`,
        name: sql<string>`name`,
        tagline: sql<string>`tagline`,
        shortTagline: sql<string>`short_tagline`,
        story: sql<string>`story`,
        location: sql<string>`location`,
        addressLine: sql<string>`address_line`,
        ctaPrimary: sql<string>`cta_primary`,
        ctaSecondary: sql<string>`cta_secondary`,
      })
      .from(sql`restaurant_info`)
      .limit(1);

    if (!legacyResult[0]) {
      throw new Error("restaurant_info row is missing.");
    }

    return {
      ...legacyResult[0],
      logo: "",
      storyImage1: "",
      storyImage1Title: "",
      storyImage1Description: "",
      storyImage2: "",
      storyImage2Title: "",
      storyImage2Description: "",
      storyImage3: "",
      storyImage3Title: "",
      storyImage3Description: "",
      phone: "",
      whatsApp: "",
      contactEmail: "",
      serviceHeaderDescription: "",
      serviceDineInDescription: "",
      serviceTakeAwayDescription: "",
      serviceImage1: "",
      serviceImage2: "",
      serviceImage3: "",
      instagram: "",
      facebook: "",
    };
  }
}

export async function getHours() {
  "use cache";

  cacheLife("max");
  cacheTag(CACHE_TAGS.hours);

  return db.select().from(hours).orderBy(asc(hours.displayOrder));
}

export async function getTestimonials() {
  "use cache";

  cacheLife("max");
  cacheTag(CACHE_TAGS.testimonials);

  return db.select().from(testimonials).orderBy(asc(testimonials.displayOrder));
}

export async function getHeroSlides() {
  "use cache";

  cacheLife("max");
  cacheTag(CACHE_TAGS.heroSlides);

  const slides = await db
    .select()
    .from(heroSlides)
    .orderBy(asc(heroSlides.displayOrder));

  return slides.map((slide) => ({
    ...slide,
    title: [slide.titleLine1, slide.titleLine2 || ""] as const,
  }));
}

async function getAllMenuCategories() {
  "use cache";

  cacheLife("max");
  cacheTag(CACHE_TAGS.menu);

  const categories = await db
    .select()
    .from(menuCategories)
    .orderBy(asc(menuCategories.displayOrder));
  const items = await db
    .select()
    .from(menuItems)
    .orderBy(asc(menuItems.displayOrder));

  return categories.map((category) => ({
    ...category,
    items: items.filter((item) => item.categoryId === category.id),
  }));
}

async function getDineInMenuCategories() {
  "use cache";

  cacheLife("max");
  cacheTag(CACHE_TAGS.menu);

  const categories = await db
    .select()
    .from(menuCategories)
    .where(eq(menuCategories.isDineIn, true))
    .orderBy(asc(menuCategories.displayOrder));
  const items = await db
    .select()
    .from(menuItems)
    .orderBy(asc(menuItems.displayOrder));

  return categories.map((category) => ({
    ...category,
    items: items.filter((item) => item.categoryId === category.id),
  }));
}

export async function getMenuCategories(isDineInOnly?: boolean) {
  return isDineInOnly ? getDineInMenuCategories() : getAllMenuCategories();
}
