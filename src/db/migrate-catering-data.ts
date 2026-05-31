import "dotenv/config";
import { eq } from "drizzle-orm";
import { db } from "./index";
import { menuItems } from "./schema";

const addOns = [
  {
    name: "Salmon Fillet",
    weight: "120 gram",
    nutrition: {
      calories: "170.4",
      protein: "23.81",
      fats: "7.61",
      carbs: "0",
      vitaminC: "0",
    },
  },
  {
    name: "Avocado",
    weight: "80 gram",
    nutrition: {
      calories: "136.8",
      protein: "1.60",
      fats: "12.24",
      carbs: "5.92",
      vitaminC: "6.40",
    },
  },
  {
    name: "Chicken Breast",
    weight: "120 gram",
    nutrition: {
      calories: "159.6",
      protein: "23.8",
      fats: "6",
      carbs: "3",
      vitaminC: "0",
    },
  },
  {
    name: "Tofu",
    weight: "120 gram",
    nutrition: {
      calories: "136.8",
      protein: "14.51",
      fats: "8.6",
      carbs: "3.38",
      vitaminC: "0.18",
    },
  },
  {
    name: "Kimchi",
    weight: "120 gram",
    nutrition: {
      calories: "22.5",
      protein: "1.2",
      fats: "0.08",
      carbs: "4.26",
      vitaminC: "52",
    },
  },
  {
    name: "Apple & Pineapple Mix",
    weight: "80 gram",
    nutrition: {
      calories: "37.2",
      protein: "0.48",
      fats: "0.2",
      carbs: "9",
      vitaminC: "8",
    },
  },
];

const sauces = [
  { name: "Honey Lime", weight: "30 gram" },
  { name: "Ginger Miso", weight: "30 gram" },
  { name: "Ponzu Tajin", weight: "30 gram" },
  { name: "Turmeric Coco", weight: "30 gram" },
];

async function main() {
  console.log("Migrating addons and sauces data to database...");
  const items = await db.select().from(menuItems);

  for (const item of items) {
    const addon = addOns.find((a) => a.name === item.name);
    if (addon) {
      console.log(`Updating ${item.name}...`);
      await db
        .update(menuItems)
        .set({
          calories: addon.nutrition.calories,
          protein: addon.nutrition.protein,
          fats: addon.nutrition.fats,
          carbs: addon.nutrition.carbs,
          vitaminC: addon.nutrition.vitaminC,
          tags: addon.weight,
        })
        .where(eq(menuItems.id, item.id));
    }

    const sauce = sauces.find((s) => s.name === item.name);
    if (sauce) {
      console.log(`Updating ${item.name}...`);
      await db
        .update(menuItems)
        .set({ tags: sauce.weight })
        .where(eq(menuItems.id, item.id));
    }
  }
  console.log("Data migration complete!");
}
main();
