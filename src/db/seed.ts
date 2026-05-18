import "dotenv/config";
import crypto from "node:crypto";
import { db } from "./index";
import {
  heroSlides,
  hours,
  menuCategories,
  menuItems,
  restaurantInfo,
  testimonials,
  users,
} from "./schema";
import data from "./seed-data.json";

async function seed() {
  console.log("Clearing existing data...");
  await db.delete(users);
  await db.delete(menuItems);
  await db.delete(menuCategories);
  await db.delete(heroSlides);
  await db.delete(testimonials);
  await db.delete(hours);
  await db.delete(restaurantInfo);

  console.log("Generating admin user...");
  const randomPassword = crypto.randomBytes(4).toString("hex"); // 8 char random password
  const email = "freshfuelpokewebsite@gmail.com";
  const passwordHash = crypto
    .createHash("sha256")
    .update(randomPassword)
    .digest("hex");

  await db.insert(users).values({
    email,
    passwordHash,
  });

  console.log("\n==================================================");
  console.log("✅ Admin User Created Successfully");
  console.log(`Email: ${email}`);
  console.log(`Password: ${randomPassword}`);
  console.log("==================================================\n");

  console.log("Inserting restaurant info...");
  await db.insert(restaurantInfo).values(data.restaurantInfo);

  console.log("Inserting hours...");
  for (let i = 0; i < data.hours.length; i++) {
    await db.insert(hours).values({
      ...data.hours[i],
      displayOrder: i,
    });
  }

  console.log("Inserting testimonials...");
  for (let i = 0; i < data.testimonials.length; i++) {
    await db.insert(testimonials).values({
      ...data.testimonials[i],
      displayOrder: i,
    });
  }

  console.log("Inserting hero slides...");
  for (let i = 0; i < data.heroSlides.length; i++) {
    await db.insert(heroSlides).values({
      ...data.heroSlides[i],
      displayOrder: i,
    });
  }

  console.log("Inserting menu categories and items...");
  for (let i = 0; i < data.menuCategories.length; i++) {
    const category = data.menuCategories[i];
    const [insertedCat] = await db
      .insert(menuCategories)
      .values({
        title: category.title,
        note: category.note,
        isDineIn: category.isDineIn,
        displayOrder: i,
      })
      .returning({ id: menuCategories.id });

    for (let j = 0; j < category.items.length; j++) {
      const item = category.items[j];
      await db.insert(menuItems).values({
        categoryId: insertedCat.id,
        name: item.name,
        price: item.price,
        image: item.image ?? null,
        displayOrder: j,
      });
    }
  }

  console.log("Seeding complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
