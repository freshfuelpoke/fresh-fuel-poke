"use client";

import { useState, useTransition } from "react";
import { addUser } from "@/app/actions/admin";

export function AddUserForm() {
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setError("");
    startTransition(async () => {
      const res = await addUser(formData);
      if (res?.error) {
        setError(res.error);
      } else if (res?.success) {
        // Clear form on success
        const form = document.getElementById(
          "add-user-form",
        ) as HTMLFormElement;
        if (form) form.reset();
      }
    });
  }

  return (
    <form id="add-user-form" action={handleSubmit} className="space-y-4">
      <div>
        <label
          className="block text-sm font-medium text-stone-700 mb-1"
          htmlFor="add-user-email"
        >
          Email
        </label>
        <input
          id="add-user-email"
          type="email"
          name="email"
          disabled={isPending}
          className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-500 disabled:opacity-50 disabled:bg-stone-50"
          required
        />
      </div>
      <div>
        <label
          className="block text-sm font-medium text-stone-700 mb-1"
          htmlFor="add-user-password"
        >
          Password
        </label>
        <input
          id="add-user-password"
          type="password"
          name="password"
          disabled={isPending}
          className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-500 disabled:opacity-50 disabled:bg-stone-50"
          required
          minLength={8}
        />
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        type="submit"
        disabled={isPending}
        className="bg-stone-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-stone-800 transition-colors disabled:opacity-50"
      >
        {isPending ? "Adding..." : "Add User"}
      </button>
    </form>
  );
}
