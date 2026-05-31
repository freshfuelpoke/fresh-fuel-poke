import "dotenv/config";
import { db } from "./index";
import { sql } from "drizzle-orm";

async function main() {
  console.log("Adding columns to menu_items...");
  try {
    await db.run(sql`ALTER TABLE menu_items ADD COLUMN description text;`);
    console.log("description added");
  } catch (e) {
    console.error("error adding description", e);
  }

  try {
    await db.run(sql`ALTER TABLE menu_items ADD COLUMN ingredients text;`);
    console.log("ingredients added");
  } catch (e) {
    console.error("error adding ingredients", e);
  }

  try {
    await db.run(sql`ALTER TABLE menu_items ADD COLUMN calories text;`);
    console.log("calories added");
  } catch (e) {
    console.error("error adding calories", e);
  }

  try {
    await db.run(sql`ALTER TABLE menu_items ADD COLUMN protein text;`);
    console.log("protein added");
  } catch (e) {
    console.error("error adding protein", e);
  }

  try {
    await db.run(sql`ALTER TABLE menu_items ADD COLUMN fats text;`);
    console.log("fats added");
  } catch (e) {
    console.error("error adding fats", e);
  }

  try {
    await db.run(sql`ALTER TABLE menu_items ADD COLUMN carbs text;`);
    console.log("carbs added");
  } catch (e) {
    console.error("error adding carbs", e);
  }

  try {
    await db.run(sql`ALTER TABLE menu_items ADD COLUMN vitamin_c text;`);
    console.log("vitamin_c added");
  } catch (e) {
    console.error("error adding vitamin_c", e);
  }

  try {
    await db.run(sql`ALTER TABLE menu_items ADD COLUMN tags text;`);
    console.log("tags added");
  } catch (e) {
    console.error("error adding tags", e);
  }

  console.log("Done");
}
main();
