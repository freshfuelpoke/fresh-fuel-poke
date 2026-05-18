"use client";

import { useFormStatus } from "react-dom";
import { logout } from "@/app/actions/admin";

function LogoutSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full px-4 py-2 text-left rounded-md hover:bg-stone-800 hover:text-white transition-colors text-stone-400 disabled:opacity-50"
    >
      {pending ? "Logging out..." : "Logout"}
    </button>
  );
}

export function LogoutButton() {
  return (
    <form action={logout}>
      <LogoutSubmitButton />
    </form>
  );
}
