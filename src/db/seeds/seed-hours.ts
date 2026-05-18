import "dotenv/config";
import { db } from "../index";
import { hours } from "../schema";
import data from "../seed-data.json";

async function seedHours() {
  console.log("Clearing existing hours...");
  await db.delete(hours);

  console.log("Inserting hours...");
  for (let i = 0; i < data.hours.length; i++) {
    await db.insert(hours).values({
      ...data.hours[i],
      displayOrder: i,
    });
  }

  console.log("Hours seeded!");
}

seedHours().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
