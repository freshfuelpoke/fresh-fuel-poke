import "dotenv/config";
import { db } from "./src/db/index";
import { menuCategories, menuItems } from "./src/db/schema";

async function main() {
  const categories = await db.select().from(menuCategories);
  const items = await db.select().from(menuItems);
  console.log(JSON.stringify({ categories, items }, null, 2));
}
main();
