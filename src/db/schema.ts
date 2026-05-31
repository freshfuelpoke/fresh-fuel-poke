import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const restaurantInfo = sqliteTable("restaurant_info", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  tagline: text("tagline").notNull(),
  shortTagline: text("short_tagline").notNull(),
  logo: text("logo").notNull().default(""),
  story: text("story").notNull().default(""),
  storyImage1: text("story_image_1").notNull().default(""),
  storyImage1Title: text("story_image_1_title").notNull().default(""),
  storyImage1Description: text("story_image_1_description")
    .notNull()
    .default(""),
  storyImage2: text("story_image_2").notNull().default(""),
  storyImage2Title: text("story_image_2_title").notNull().default(""),
  storyImage2Description: text("story_image_2_description")
    .notNull()
    .default(""),
  storyImage3: text("story_image_3").notNull().default(""),
  storyImage3Title: text("story_image_3_title").notNull().default(""),
  storyImage3Description: text("story_image_3_description")
    .notNull()
    .default(""),
  location: text("location").notNull(),
  addressLine: text("address_line").notNull(),
  phone: text("phone").notNull().default(""),
  whatsApp: text("whats_app").notNull().default(""),
  contactEmail: text("contact_email").notNull().default(""),
  ctaPrimary: text("cta_primary").notNull(),
  ctaSecondary: text("cta_secondary").notNull(),
  serviceHeaderDescription: text("service_header_description")
    .notNull()
    .default(""),
  serviceDineInDescription: text("service_dine_in_description")
    .notNull()
    .default(""),
  serviceTakeAwayDescription: text("service_take_away_description")
    .notNull()
    .default(""),
  // Reserved from an earlier draft. The current public/admin flow only uses serviceImage2/3.
  serviceImage1: text("service_image_1").notNull().default(""),
  serviceImage2: text("service_image_2").notNull().default(""),
  serviceImage3: text("service_image_3").notNull().default(""),
  instagram: text("instagram").notNull().default(""),
  facebook: text("facebook").notNull().default(""),
});

export const hours = sqliteTable("hours", {
  id: integer("id").primaryKey(),
  label: text("label").notNull(),
  value: text("value").notNull(),
  displayOrder: integer("display_order").notNull().default(0),
});

export const testimonials = sqliteTable("testimonials", {
  id: integer("id").primaryKey(),
  quote: text("quote").notNull(),
  name: text("name").notNull(),
  context: text("context").notNull(),
  displayOrder: integer("display_order").notNull().default(0),
});

export const heroSlides = sqliteTable("hero_slides", {
  id: integer("id").primaryKey(),
  src: text("src").notNull(),
  alt: text("alt").notNull(),
  label: text("label"),
  titleLine1: text("title_line1").notNull(),
  titleLine2: text("title_line2"),
  accent: text("accent"),
  description: text("description").notNull(),
  displayOrder: integer("display_order").notNull().default(0),
});

export const menuCategories = sqliteTable("menu_categories", {
  id: integer("id").primaryKey(),
  title: text("title").notNull(),
  note: text("note"),
  displayOrder: integer("display_order").notNull().default(0),
  // isDineIn means it's available on the dine in page.
  isDineIn: integer("is_dine_in", { mode: "boolean" }).notNull().default(true),
});

export const menuItems = sqliteTable("menu_items", {
  id: integer("id").primaryKey(),
  categoryId: integer("category_id")
    .notNull()
    .references(() => menuCategories.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  price: text("price").notNull(),
  image: text("image"),
  description: text("description"),
  ingredients: text("ingredients"),
  calories: text("calories"),
  protein: text("protein"),
  fats: text("fats"),
  carbs: text("carbs"),
  vitaminC: text("vitamin_c"),
  tags: text("tags"),
  displayOrder: integer("display_order").notNull().default(0),
});

export const users = sqliteTable("users", {
  id: integer("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
});
