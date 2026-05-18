import "dotenv/config";
import crypto from "node:crypto";
import { db } from "../index";
import { users } from "../schema";

async function seedUsers() {
  console.log("Clearing existing users...");
  await db.delete(users);

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
}

seedUsers().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
