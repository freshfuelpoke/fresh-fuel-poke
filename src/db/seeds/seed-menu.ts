import "dotenv/config";
import { db } from "../index";
import { menuCategories, menuItems } from "../schema";
import data from "../seed-data.json";

async function seedMenu() {
  console.log("Clearing existing menu categories and items...");
  await db.delete(menuItems);
  await db.delete(menuCategories);

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

  console.log("Menu seeded!");
}

seedMenu().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
