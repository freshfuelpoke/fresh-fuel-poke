"use server";

import crypto from "node:crypto";
import { eq, max } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/db";
import {
  heroSlides,
  hours,
  menuCategories,
  menuItems,
  restaurantInfo,
  users,
} from "@/db/schema";
import { CACHE_TAGS, type CacheTag } from "@/lib/cache";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function hashPassword(password: string) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

async function requireAuth() {
  const session = (await cookies()).get("admin_session");
  if (session?.value !== "authenticated") throw new Error("Unauthorized");
}

async function getCurrentAdmin() {
  await requireAuth();

  const cookieStore = await cookies();
  const userIdValue = cookieStore.get("admin_user_id")?.value;
  const email = cookieStore.get("admin_user_email")?.value;
  const id = userIdValue ? Number.parseInt(userIdValue, 10) : Number.NaN;

  if (!Number.isNaN(id) && email) {
    return { id, email };
  }

  throw new Error("Unauthorized");
}

function invalidateTag(tag: CacheTag) {
  revalidateTag(tag, "max");
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) return { error: "Email and password are required" };

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (user && user.passwordHash === hashPassword(password)) {
    const cookieStore = await cookies();

    cookieStore.set("admin_session", "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
    cookieStore.set("admin_user_id", String(user.id), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
    cookieStore.set("admin_user_email", user.email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
    redirect("/admin");
  } else {
    return { error: "Invalid email or password" };
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
  cookieStore.delete("admin_user_id");
  cookieStore.delete("admin_user_email");
  redirect("/admin/login");
}

// ─── Users ────────────────────────────────────────────────────────────────────

export async function addUser(formData: FormData) {
  await requireAuth();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) return { error: "Email and password are required" };

  try {
    await db
      .insert(users)
      .values({ email, passwordHash: hashPassword(password) });
    invalidateTag(CACHE_TAGS.users);
    return { success: true };
  } catch {
    return { error: "Failed to add user. Email may already exist." };
  }
}

export async function deleteUser(id: number) {
  const currentAdmin = await getCurrentAdmin();

  if (currentAdmin.id === id) {
    return { error: "You cannot delete your own account." };
  }

  await db.delete(users).where(eq(users.id, id));
  invalidateTag(CACHE_TAGS.users);
  return { success: true };
}

export async function updateUserEmail(formData: FormData) {
  const currentAdmin = await getCurrentAdmin();
  const id = Number.parseInt(formData.get("id") as string, 10);
  const email = (formData.get("email") as string)?.trim();

  if (!id || !email) {
    return { error: "Email is required." };
  }

  try {
    await db.update(users).set({ email }).where(eq(users.id, id));

    if (currentAdmin.id === id) {
      (await cookies()).set("admin_user_email", email, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      });
    }

    invalidateTag(CACHE_TAGS.users);
    return { success: true };
  } catch {
    return { error: "Failed to update user. Email may already exist." };
  }
}

export async function updateUserPassword(formData: FormData) {
  try {
    await requireAuth();
    const id = Number.parseInt(formData.get("id") as string, 10);
    const password = (formData.get("password") as string | null)?.trim();

    if (!id || !password) {
      return { error: "Password is required." };
    }

    if (password.length < 8) {
      return { error: "Password must be at least 8 characters." };
    }

    await db
      .update(users)
      .set({ passwordHash: hashPassword(password) })
      .where(eq(users.id, id));
    invalidateTag(CACHE_TAGS.users);
    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      error:
        errorMessage === "Unauthorized"
          ? "Your admin session expired. Log in again and retry."
          : "Failed to update password.",
    };
  }
}

// ─── Restaurant Info ──────────────────────────────────────────────────────────

export async function updateRestaurantInfo(formData: FormData) {
  await requireAuth();
  const name = formData.get("name") as string;
  const tagline = formData.get("tagline") as string;
  const shortTagline = formData.get("shortTagline") as string;
  const logo = (formData.get("logo") as string) ?? "";
  const story = formData.get("story") as string;
  const storyImage1 = formData.get("storyImage1") as string;
  const storyImage1Title = formData.get("storyImage1Title") as string;
  const storyImage1Description = formData.get(
    "storyImage1Description",
  ) as string;
  const storyImage2 = formData.get("storyImage2") as string;
  const storyImage2Title = formData.get("storyImage2Title") as string;
  const storyImage2Description = formData.get(
    "storyImage2Description",
  ) as string;
  const storyImage3 = formData.get("storyImage3") as string;
  const storyImage3Title = formData.get("storyImage3Title") as string;
  const storyImage3Description = formData.get(
    "storyImage3Description",
  ) as string;
  const location = formData.get("location") as string;
  const addressLine = formData.get("addressLine") as string;
  const phone = (formData.get("phone") as string) ?? "";
  const whatsApp = (formData.get("whatsApp") as string) ?? "";
  const contactEmail = (formData.get("contactEmail") as string) ?? "";
  const serviceHeaderDescription =
    (formData.get("serviceHeaderDescription") as string) ?? "";
  const serviceDineInDescription =
    (formData.get("serviceDineInDescription") as string) ?? "";
  const serviceTakeAwayDescription =
    (formData.get("serviceTakeAwayDescription") as string) ?? "";
  const serviceImage2 = (formData.get("serviceImage2") as string) ?? "";
  const serviceImage3 = (formData.get("serviceImage3") as string) ?? "";
  const instagram = (formData.get("instagram") as string) ?? "";
  const facebook = (formData.get("facebook") as string) ?? "";

  try {
    const [existing] = await db
      .select({ id: restaurantInfo.id })
      .from(restaurantInfo)
      .limit(1);
    if (existing) {
      await db
        .update(restaurantInfo)
        .set({
          name,
          tagline,
          shortTagline,
          logo,
          story,
          storyImage1,
          storyImage1Title,
          storyImage1Description,
          storyImage2,
          storyImage2Title,
          storyImage2Description,
          storyImage3,
          storyImage3Title,
          storyImage3Description,
          location,
          addressLine,
          phone,
          whatsApp,
          contactEmail,
          serviceHeaderDescription,
          serviceDineInDescription,
          serviceTakeAwayDescription,
          serviceImage2,
          serviceImage3,
          instagram,
          facebook,
        })
        .where(eq(restaurantInfo.id, existing.id));
    } else {
      await db.insert(restaurantInfo).values({
        name,
        tagline,
        shortTagline,
        logo,
        story,
        storyImage1,
        storyImage1Title,
        storyImage1Description,
        storyImage2,
        storyImage2Title,
        storyImage2Description,
        storyImage3,
        storyImage3Title,
        storyImage3Description,
        location,
        addressLine,
        phone,
        whatsApp,
        contactEmail,
        ctaPrimary: "Order Now",
        ctaSecondary: "View Menu",
        serviceHeaderDescription,
        serviceDineInDescription,
        serviceTakeAwayDescription,
        serviceImage2,
        serviceImage3,
        instagram,
        facebook,
      });
    }
    invalidateTag(CACHE_TAGS.restaurantInfo);
    return { success: true };
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

    return {
      error:
        causeMessage || errorMessage || "Failed to update restaurant info.",
    };
  }
}

// ─── Hours ────────────────────────────────────────────────────────────────────

export async function addHour(formData: FormData) {
  await requireAuth();
  const label = formData.get("label") as string;
  const value = formData.get("value") as string;

  if (!label || !value) return { error: "Label and value are required." };

  try {
    const [maxOrder] = await db
      .select({ m: max(hours.displayOrder) })
      .from(hours);
    const nextOrder = (maxOrder?.m ?? -1) + 1;
    const [newRow] = await db
      .insert(hours)
      .values({ label, value, displayOrder: nextOrder })
      .returning();
    invalidateTag(CACHE_TAGS.hours);
    return { success: true, row: newRow };
  } catch {
    return { error: "Failed to add hour." };
  }
}

export async function deleteHour(id: number) {
  await requireAuth();
  await db.delete(hours).where(eq(hours.id, id));
  invalidateTag(CACHE_TAGS.hours);
  return { success: true };
}

// ─── Hero Slides ──────────────────────────────────────────────────────────────

export async function addHeroSlide(formData: FormData) {
  await requireAuth();
  const src = formData.get("src") as string;
  const alt = formData.get("alt") as string;
  const label = formData.get("label") as string;
  const titleLine1 = formData.get("titleLine1") as string;
  const titleLine2 = formData.get("titleLine2") as string;
  const accent = formData.get("accent") as string;
  const description = formData.get("description") as string;

  if (!src || !titleLine1 || !description)
    return { error: "Image, title, and description are required." };

  try {
    const [maxOrder] = await db
      .select({ m: max(heroSlides.displayOrder) })
      .from(heroSlides);
    const nextOrder = (maxOrder?.m ?? -1) + 1;
    await db.insert(heroSlides).values({
      src,
      alt,
      label,
      titleLine1,
      titleLine2,
      accent,
      description,
      displayOrder: nextOrder,
    });
    invalidateTag(CACHE_TAGS.heroSlides);
    return { success: true };
  } catch {
    return { error: "Failed to add slide." };
  }
}

export async function updateHeroSlide(id: number, formData: FormData) {
  await requireAuth();
  const src = formData.get("src") as string;
  const alt = formData.get("alt") as string;
  const label = formData.get("label") as string;
  const titleLine1 = formData.get("titleLine1") as string;
  const titleLine2 = formData.get("titleLine2") as string;
  const accent = formData.get("accent") as string;
  const description = formData.get("description") as string;

  try {
    await db
      .update(heroSlides)
      .set({ src, alt, label, titleLine1, titleLine2, accent, description })
      .where(eq(heroSlides.id, id));
    invalidateTag(CACHE_TAGS.heroSlides);
    return { success: true };
  } catch {
    return { error: "Failed to update slide." };
  }
}

export async function deleteHeroSlide(id: number) {
  await requireAuth();
  await db.delete(heroSlides).where(eq(heroSlides.id, id));
  invalidateTag(CACHE_TAGS.heroSlides);
  return { success: true };
}

// ─── Menu Categories ──────────────────────────────────────────────────────────

export async function addMenuCategory(formData: FormData) {
  await requireAuth();
  const title = formData.get("title") as string;
  const note = formData.get("note") as string;
  const isDineIn = formData.get("isDineIn") === "true";

  if (!title) return { error: "Title is required." };

  try {
    const [maxOrder] = await db
      .select({ m: max(menuCategories.displayOrder) })
      .from(menuCategories);
    const nextOrder = (maxOrder?.m ?? -1) + 1;
    await db
      .insert(menuCategories)
      .values({ title, note, isDineIn, displayOrder: nextOrder });
    invalidateTag(CACHE_TAGS.menu);
    return { success: true };
  } catch {
    return { error: "Failed to add category." };
  }
}

export async function deleteMenuCategory(id: number) {
  await requireAuth();
  await db.delete(menuCategories).where(eq(menuCategories.id, id));
  invalidateTag(CACHE_TAGS.menu);
  return { success: true };
}

// ─── Menu Items ───────────────────────────────────────────────────────────────

export async function addMenuItem(formData: FormData) {
  await requireAuth();
  const categoryId = parseInt(formData.get("categoryId") as string, 10);
  const name = formData.get("name") as string;
  const price = formData.get("price") as string;
  const image = (formData.get("image") as string | null)?.trim() || null;
  const description = (formData.get("description") as string | null)?.trim() || null;
  const ingredients = (formData.get("ingredients") as string | null)?.trim() || null;
  const calories = (formData.get("calories") as string | null)?.trim() || null;
  const protein = (formData.get("protein") as string | null)?.trim() || null;
  const fats = (formData.get("fats") as string | null)?.trim() || null;
  const carbs = (formData.get("carbs") as string | null)?.trim() || null;
  const vitaminC = (formData.get("vitaminC") as string | null)?.trim() || null;
  const tags = (formData.get("tags") as string | null)?.trim() || null;

  if (!name || !price || !categoryId)
    return { error: "All fields are required." };

  try {
    const [maxOrder] = await db
      .select({ m: max(menuItems.displayOrder) })
      .from(menuItems)
      .where(eq(menuItems.categoryId, categoryId));
    const nextOrder = (maxOrder?.m ?? -1) + 1;
    await db
      .insert(menuItems)
      .values({
        categoryId,
        name,
        price,
        image,
        description,
        ingredients,
        calories,
        protein,
        fats,
        carbs,
        vitaminC,
        tags,
        displayOrder: nextOrder,
      });
    invalidateTag(CACHE_TAGS.menu);
    return { success: true };
  } catch {
    return { error: "Failed to add item." };
  }
}

export async function updateMenuItemImage(id: number, image: string) {
  await requireAuth();
  const normalizedImage = image.trim();

  if (!id || !normalizedImage) {
    return { error: "A valid image is required." };
  }

  try {
    await db
      .update(menuItems)
      .set({ image: normalizedImage })
      .where(eq(menuItems.id, id));
    invalidateTag(CACHE_TAGS.menu);
    return { success: true };
  } catch {
    return { error: "Failed to update menu item image." };
  }
}

export async function updateMenuItem(formData: FormData) {
  await requireAuth();
  const id = parseInt(formData.get("id") as string, 10);
  const name = formData.get("name") as string;
  const price = formData.get("price") as string;
  const image = (formData.get("image") as string | null)?.trim() || null;
  const description = (formData.get("description") as string | null)?.trim() || null;
  const ingredients = (formData.get("ingredients") as string | null)?.trim() || null;
  const calories = (formData.get("calories") as string | null)?.trim() || null;
  const protein = (formData.get("protein") as string | null)?.trim() || null;
  const fats = (formData.get("fats") as string | null)?.trim() || null;
  const carbs = (formData.get("carbs") as string | null)?.trim() || null;
  const vitaminC = (formData.get("vitaminC") as string | null)?.trim() || null;
  const tags = (formData.get("tags") as string | null)?.trim() || null;

  if (!id || !name || !price) {
    return { error: "Name and price are required." };
  }

  try {
    await db
      .update(menuItems)
      .set({
        name,
        price,
        image,
        description,
        ingredients,
        calories,
        protein,
        fats,
        carbs,
        vitaminC,
        tags,
      })
      .where(eq(menuItems.id, id));
    invalidateTag(CACHE_TAGS.menu);
    return { success: true };
  } catch {
    return { error: "Failed to update item." };
  }
}

export async function deleteMenuItem(id: number) {
  await requireAuth();
  await db.delete(menuItems).where(eq(menuItems.id, id));
  invalidateTag(CACHE_TAGS.menu);
  return { success: true };
}

// ─── Generic revalidate ───────────────────────────────────────────────────────

export async function revalidateData(tag: CacheTag) {
  await requireAuth();
  invalidateTag(tag);
  return { success: true };
}
