import { cookies } from "next/headers";
import { Suspense } from "react";
import { db } from "@/db";
import { users } from "@/db/schema";
import { UsersManager } from "./users-manager";

async function UsersPageContent() {
  const allUsers = await db
    .select({ id: users.id, email: users.email })
    .from(users);
  const currentUserIdValue = (await cookies()).get("admin_user_id")?.value;
  const currentUserId = currentUserIdValue
    ? Number.parseInt(currentUserIdValue, 10)
    : -1;

  return <UsersManager initialUsers={allUsers} currentUserId={currentUserId} />;
}

function UsersPageFallback() {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-6 text-sm text-stone-500 shadow-sm">
      Loading users...
    </div>
  );
}

export default function UsersPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="mb-2 text-3xl font-serif text-stone-900">
          Manage Users
        </h1>
        <p className="text-stone-600">
          Add, edit, or remove admin users. You cannot delete your own account.
        </p>
      </div>

      <Suspense fallback={<UsersPageFallback />}>
        <UsersPageContent />
      </Suspense>
    </div>
  );
}
