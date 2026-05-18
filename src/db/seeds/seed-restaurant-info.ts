import "dotenv/config";
import { db } from "../index";
import { restaurantInfo } from "../schema";
import data from "../seed-data.json";

async function seedRestaurantInfo() {
  console.log("Clearing existing restaurant info...");
  await db.delete(restaurantInfo);

  console.log("Inserting restaurant info...");
  await db.insert(restaurantInfo).values(data.restaurantInfo);

  console.log("Restaurant info seeded!");
}

seedRestaurantInfo().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
