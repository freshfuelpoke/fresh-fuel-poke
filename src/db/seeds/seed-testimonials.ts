import "dotenv/config";
import { db } from "../index";
import { testimonials } from "../schema";
import data from "../seed-data.json";

async function seedTestimonials() {
  console.log("Clearing existing testimonials...");
  await db.delete(testimonials);

  console.log("Inserting testimonials...");
  for (let i = 0; i < data.testimonials.length; i++) {
    await db.insert(testimonials).values({
      ...data.testimonials[i],
      displayOrder: i,
    });
  }

  console.log("Testimonials seeded!");
}

seedTestimonials().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
