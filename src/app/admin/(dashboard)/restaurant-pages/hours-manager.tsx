"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { addHour, deleteHour } from "@/app/actions/admin";

type Hour = { id: number; label: string; value: string; displayOrder: number };

function TrashIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="M19 6l-1 14H6L5 6" />
      <path d="M10 11v5" />
      <path d="M14 11v5" />
    </svg>
  );
}

export function HoursManager({ hours }: { hours: Hour[] }) {
  const [localHours, setLocalHours] = useState<Hour[]>(hours);
  const [deleteHourState, setDeleteHourState] = useState<Hour | null>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const router = useRouter();

  function handleAdd(formData: FormData) {
    setError("");
    startTransition(async () => {
      const res = await addHour(formData);
      if (res?.error) {
        setError(res.error);
      } else if (res?.row) {
        // Immediately append the new row to the list
        setLocalHours((prev) => [...prev, res.row]);
        const form = document.getElementById(
          "add-hour-form",
        ) as HTMLFormElement;
        if (form) form.reset();
        router.refresh();
      }
    });
  }

  function closeDeleteDialog() {
    if (isPending) return;
    setDeleteHourState(null);
  }

  function handleConfirmDelete() {
    if (!deleteHourState) return;

    startTransition(async () => {
      await deleteHour(deleteHourState.id);
      setLocalHours((prev) =>
        prev.filter((hour) => hour.id !== deleteHourState.id),
      );
      setDeleteHourState(null);
      router.refresh();
    });
  }

  return (
    <>
      <div className="space-y-4">
        {localHours.length > 0 ? (
          <ul className="space-y-2">
            {localHours.map((hour) => (
              <li
                key={hour.id}
                className="flex items-center justify-between gap-3 p-3 bg-stone-50 rounded-xl border border-stone-100"
              >
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-stone-400">
                    {hour.label}
                  </p>
                  <p className="text-sm text-stone-700 truncate">
                    {hour.value}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setDeleteHourState(hour)}
                  disabled={isPending}
                  className="shrink-0 p-1.5 text-stone-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all disabled:opacity-40"
                  aria-label="Delete hour row"
                >
                  <TrashIcon />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-stone-400 italic py-4 text-center">
            No hours added yet.
          </p>
        )}

        <div className="border-t border-stone-100 pt-4">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-stone-400 mb-3">
            Add New Hour Row
          </p>
          <form id="add-hour-form" action={handleAdd} className="space-y-3">
            <input
              type="text"
              name="label"
              disabled={isPending}
              placeholder="e.g. MON – FRI"
              className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/20 focus:border-stone-400 transition-all disabled:opacity-50"
              required
            />
            <input
              type="text"
              name="value"
              disabled={isPending}
              placeholder="e.g. 10:00 am – 6:00 pm (Dine-in)"
              className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/20 focus:border-stone-400 transition-all disabled:opacity-50"
              required
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-stone-900 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-stone-700 transition-colors disabled:opacity-40"
            >
              {isPending ? "Adding…" : "+ Add Row"}
            </button>
          </form>
        </div>
      </div>
      {deleteHourState && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/55 p-4">
          <button
            type="button"
            className="absolute inset-0"
            onClick={closeDeleteDialog}
            disabled={isPending}
            aria-label="Close dialog"
          />
          <div className="relative w-full max-w-xl rounded-[28px] border border-stone-200 bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-stone-100 px-6 py-5">
              <div>
                <h3 className="text-xl font-semibold text-stone-900">
                  Delete hour row
                </h3>
                <p className="mt-1 text-sm text-stone-500">
                  Are you sure? You cannot undo this action.
                </p>
              </div>
              <button
                type="button"
                onClick={closeDeleteDialog}
                disabled={isPending}
                className="rounded-full p-2 text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-700 disabled:opacity-40"
                aria-label="Close dialog"
              >
                ✕
              </button>
            </div>
            <div className="space-y-5 px-6 py-6">
              <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-4 text-sm text-red-700">
                This will permanently delete {deleteHourState.label}:{" "}
                {deleteHourState.value}.
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeDeleteDialog}
                  disabled={isPending}
                  className="rounded-xl border border-stone-200 px-4 py-2.5 text-sm font-semibold text-stone-600 transition-colors hover:bg-stone-100 disabled:opacity-40"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  disabled={isPending}
                  className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-500 disabled:opacity-40"
                >
                  {isPending ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
