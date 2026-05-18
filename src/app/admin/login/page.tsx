"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { login } from "@/app/actions/admin";

function LoginSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-stone-900 text-white py-2 rounded-lg font-medium hover:bg-stone-800 transition-colors disabled:opacity-50"
    >
      {pending ? "Logging in..." : "Login"}
    </button>
  );
}

export default function LoginPage() {
  const [error, setError] = useState("");

  async function handleSubmit(formData: FormData) {
    setError("");
    const res = await login(formData);
    if (res?.error) {
      setError(res.error);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border border-stone-200">
        <h1 className="text-2xl font-serif text-stone-900 mb-6 text-center">
          Fresh Fuel Admin
        </h1>
        <form action={handleSubmit} className="space-y-4">
          <div>
            <label
              className="block text-sm font-medium text-stone-700 mb-1"
              htmlFor="admin-login-email"
            >
              Email
            </label>
            <input
              id="admin-login-email"
              type="email"
              name="email"
              className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-500 disabled:opacity-50 disabled:bg-stone-50"
              required
            />
          </div>
          <div>
            <label
              className="block text-sm font-medium text-stone-700 mb-1"
              htmlFor="admin-login-password"
            >
              Password
            </label>
            <input
              id="admin-login-password"
              type="password"
              name="password"
              className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-500 disabled:opacity-50 disabled:bg-stone-50"
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <LoginSubmitButton />
        </form>
      </div>
    </div>
  );
}
