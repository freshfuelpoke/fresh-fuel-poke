import "dotenv/config";
import { db } from "../index";
import { heroSlides } from "../schema";
import data from "../seed-data.json";

async function seedHeroSlides() {
  console.log("Clearing existing hero slides...");
  await db.delete(heroSlides);

  console.log("Inserting hero slides...");
  for (let i = 0; i < data.heroSlides.length; i++) {
    await db.insert(heroSlides).values({
      ...data.heroSlides[i],
      displayOrder: i,
    });
  }

  console.log("Hero slides seeded!");
}

seedHeroSlides().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
