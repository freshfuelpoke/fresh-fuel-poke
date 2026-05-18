import "dotenv/config";
import { eq } from "drizzle-orm";
import { db } from "../index";
import { restaurantInfo } from "../schema";
import data from "../seed-data.json";

async function seedDine() {
  console.log("Updating restaurant info with dine-in & delivery details...");
  
  // Get the existing restaurant info record
  const existing = await db.select().from(restaurantInfo).limit(1);
  
  if (existing.length > 0) {
    await db.update(restaurantInfo).set({
      serviceHeaderDescription: data.restaurantInfo.serviceHeaderDescription,
      serviceDineInDescription: data.restaurantInfo.serviceDineInDescription,
      serviceTakeAwayDescription: data.restaurantInfo.serviceTakeAwayDescription,
      serviceImage2: data.restaurantInfo.serviceImage2,
      serviceImage3: data.restaurantInfo.serviceImage3,
    }).where(eq(restaurantInfo.id, existing[0].id));
    console.log("Dine-in & delivery details updated!");
  } else {
    console.log("No restaurant info found. Seeding entire restaurant info instead...");
    await db.insert(restaurantInfo).values(data.restaurantInfo);
    console.log("Restaurant info seeded with dine-in details!");
  }
}

seedDine().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
