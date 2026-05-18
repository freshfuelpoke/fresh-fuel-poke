"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import {
  addUser,
  deleteUser,
  updateUserEmail,
  updateUserPassword,
} from "@/app/actions/admin";

type User = {
  id: number;
  email: string;
};

function EditIcon() {
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
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 1 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  );
}

function LockIcon() {
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
      <rect x="4" y="11" width="16" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 1 1 8 0v3" />
    </svg>
  );
}

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

function SparklesIcon() {
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
      <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3Z" />
      <path d="M19 14l.75 2.25L22 17l-2.25.75L19 20l-.75-2.25L16 17l2.25-.75L19 14Z" />
      <path d="M5 14l.75 2.25L8 17l-2.25.75L5 20l-.75-2.25L2 17l2.25-.75L5 14Z" />
    </svg>
  );
}

function ModalFrame({
  title,
  description,
  onClose,
  isPending,
  children,
}: {
  title: string;
  description: string;
  onClose: () => void;
  isPending?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/55 p-4">
      <button
        type="button"
        className="absolute inset-0"
        onClick={() => {
          if (!isPending) onClose();
        }}
        disabled={isPending}
        aria-label="Close dialog"
      />
      <div className="relative w-full max-w-xl rounded-[28px] border border-stone-200 bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-stone-100 px-6 py-5">
          <div>
            <h3 className="text-xl font-semibold text-stone-900">{title}</h3>
            <p className="mt-1 text-sm text-stone-500">{description}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="rounded-full p-2 text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-700 disabled:opacity-40"
            aria-label="Close dialog"
          >
            ✕
          </button>
        </div>
        <div className="px-6 py-6">{children}</div>
      </div>
    </div>
  );
}

function generatePassword(length = 14) {
  const alphabet =
    "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*";

  return Array.from({ length }, () => {
    const index = Math.floor(Math.random() * alphabet.length);
    return alphabet[index];
  }).join("");
}

export function UsersManager({
  initialUsers,
  currentUserId,
}: {
  initialUsers: User[];
  currentUserId: number;
}) {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [addError, setAddError] = useState("");
  const [emailEditorUser, setEmailEditorUser] = useState<User | null>(null);
  const [passwordEditorUser, setPasswordEditorUser] = useState<User | null>(
    null,
  );
  const [deleteUserState, setDeleteUserState] = useState<User | null>(null);
  const [emailValue, setEmailValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [newUserPasswordValue, setNewUserPasswordValue] = useState("");
  const [modalError, setModalError] = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!emailEditorUser) {
      setEmailValue("");
      setModalError("");
      return;
    }

    setEmailValue(emailEditorUser.email);
    setModalError("");
  }, [emailEditorUser]);

  useEffect(() => {
    if (!passwordEditorUser) {
      setPasswordValue("");
      setModalError("");
      return;
    }

    setPasswordValue("");
    setModalError("");
  }, [passwordEditorUser]);

  function handleAddUser(formData: FormData) {
    setAddError("");
    startTransition(async () => {
      const res = await addUser(formData);

      if (res?.error) {
        setAddError(res.error);
        return;
      }

      const email = (formData.get("email") as string).trim();
      setUsers((prev) => [...prev, { id: Date.now(), email }]);
      const form = document.getElementById(
        "add-user-form",
      ) as HTMLFormElement | null;
      form?.reset();
      setNewUserPasswordValue("");
    });
  }

  function handleSaveEmail() {
    if (!emailEditorUser) return;

    const trimmedEmail = emailValue.trim();

    if (!trimmedEmail) {
      setModalError("Email is required.");
      return;
    }

    const formData = new FormData();
    formData.set("id", String(emailEditorUser.id));
    formData.set("email", trimmedEmail);

    startTransition(async () => {
      const res = await updateUserEmail(formData);

      if (res?.error) {
        setModalError(res.error);
        return;
      }

      setUsers((prev) =>
        prev.map((user) =>
          user.id === emailEditorUser.id
            ? { ...user, email: trimmedEmail }
            : user,
        ),
      );
      setEmailEditorUser(null);
    });
  }

  function handleGeneratePassword() {
    setPasswordValue(generatePassword());
    setModalError("");
  }

  function handleGenerateNewUserPassword() {
    setNewUserPasswordValue(generatePassword());
    setAddError("");
  }

  function handleSavePassword() {
    if (!passwordEditorUser) return;

    const trimmedPassword = passwordValue.trim();

    if (!trimmedPassword) {
      setModalError("Password is required.");
      return;
    }

    if (trimmedPassword.length < 8) {
      setModalError("Password must be at least 8 characters.");
      return;
    }

    const formData = new FormData();
    formData.set("id", String(passwordEditorUser.id));
    formData.set("password", trimmedPassword);

    startTransition(async () => {
      const res = await updateUserPassword(formData);

      if (res?.error) {
        setModalError(res.error);
        return;
      }

      setPasswordEditorUser(null);
    });
  }

  function handleConfirmDelete() {
    if (!deleteUserState) return;

    startTransition(async () => {
      const res = await deleteUser(deleteUserState.id);

      if (res?.error) {
        setModalError(res.error);
        return;
      }

      setUsers((prev) => prev.filter((user) => user.id !== deleteUserState.id));
      setDeleteUserState(null);
      router.refresh();
    });
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-xl font-medium text-stone-900">
            Add Admin User
          </h3>
          <form id="add-user-form" action={handleAddUser} className="space-y-4">
            <div>
              <label
                htmlFor="new-user-email"
                className="mb-1 block text-sm font-medium text-stone-700"
              >
                Email
              </label>
              <input
                id="new-user-email"
                type="email"
                name="email"
                disabled={isPending}
                className="w-full rounded-lg border border-stone-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-stone-500 disabled:opacity-50 disabled:bg-stone-50"
                required
              />
            </div>
            <div>
              <label
                htmlFor="new-user-password"
                className="mb-1 block text-sm font-medium text-stone-700"
              >
                Password
              </label>
              <input
                id="new-user-password"
                type="text"
                name="password"
                value={newUserPasswordValue}
                onChange={(event) =>
                  setNewUserPasswordValue(event.target.value)
                }
                disabled={isPending}
                className="w-full rounded-lg border border-stone-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-stone-500 disabled:opacity-50 disabled:bg-stone-50"
                required
                minLength={8}
              />
              <button
                type="button"
                onClick={handleGenerateNewUserPassword}
                disabled={isPending}
                className="mt-3 inline-flex items-center gap-2 rounded-lg border border-stone-200 px-3 py-2 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-100 disabled:opacity-40"
              >
                <SparklesIcon />
                Generate Password
              </button>
            </div>
            {addError && <p className="text-sm text-red-500">{addError}</p>}
            <button
              type="submit"
              disabled={isPending}
              className="rounded-lg bg-stone-900 px-4 py-2 font-medium text-white transition-colors hover:bg-stone-800 disabled:opacity-50"
            >
              {isPending ? "Adding..." : "Add User"}
            </button>
          </form>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-xl font-medium text-stone-900">
            Existing Users
          </h3>
          <ul className="space-y-3">
            {users.map((user) => {
              const isCurrentUser = user.id === currentUserId;

              return (
                <li
                  key={user.id}
                  className="flex items-center justify-between rounded-lg border border-stone-100 bg-stone-50 p-3"
                >
                  <div>
                    <span className="text-stone-700">{user.email}</span>
                    {isCurrentUser && (
                      <p className="mt-1 text-xs text-stone-400">
                        Current account
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        setModalError("");
                        setEmailEditorUser(user);
                      }}
                      disabled={isPending}
                      className="rounded-md p-2 text-stone-400 transition-colors hover:bg-stone-200 hover:text-stone-700 disabled:opacity-30"
                      aria-label={`Edit ${user.email}`}
                    >
                      <EditIcon />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setModalError("");
                        setPasswordEditorUser(user);
                      }}
                      disabled={isPending}
                      className="rounded-md p-2 text-stone-400 transition-colors hover:bg-stone-200 hover:text-stone-700 disabled:opacity-30"
                      aria-label={`Change password for ${user.email}`}
                    >
                      <LockIcon />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setModalError("");
                        setDeleteUserState(user);
                      }}
                      disabled={isCurrentUser || isPending}
                      className="rounded-md p-2 text-stone-400 transition-colors hover:bg-stone-200 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-30"
                      aria-label={`Delete ${user.email}`}
                    >
                      <TrashIcon />
                    </button>
                  </div>
                </li>
              );
            })}
            {users.length === 0 && (
              <p className="text-sm text-stone-500">No users found.</p>
            )}
          </ul>
        </div>
      </div>

      {emailEditorUser && (
        <ModalFrame
          title="Edit user email"
          description="Update the email address for this admin user."
          isPending={isPending}
          onClose={() => {
            if (!isPending) {
              setEmailEditorUser(null);
              setModalError("");
            }
          }}
        >
          <div className="space-y-4">
            <div>
              <label
                htmlFor="edit-user-email"
                className="mb-1 block text-sm font-medium text-stone-700"
              >
                Email
              </label>
              <input
                id="edit-user-email"
                type="email"
                value={emailValue}
                onChange={(event) => setEmailValue(event.target.value)}
                disabled={isPending}
                className="w-full rounded-lg border border-stone-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-stone-500 disabled:opacity-50 disabled:bg-stone-50"
                required
              />
            </div>
            {modalError && (
              <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                {modalError}
              </p>
            )}
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  if (!isPending) {
                    setEmailEditorUser(null);
                    setModalError("");
                  }
                }}
                disabled={isPending}
                className="rounded-xl border border-stone-200 px-4 py-2.5 text-sm font-semibold text-stone-600 transition-colors hover:bg-stone-100 disabled:opacity-40"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveEmail}
                disabled={isPending}
                className="rounded-xl bg-stone-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-stone-700 disabled:opacity-40"
              >
                {isPending ? "Saving..." : "Save email"}
              </button>
            </div>
          </div>
        </ModalFrame>
      )}

      {passwordEditorUser && (
        <ModalFrame
          title="Change password"
          description="Set a new password for this admin user."
          isPending={isPending}
          onClose={() => {
            if (!isPending) {
              setPasswordEditorUser(null);
              setModalError("");
            }
          }}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <label
                htmlFor="edit-user-password"
                className="block text-sm font-medium text-stone-700"
              >
                New Password
              </label>
              <button
                type="button"
                onClick={handleGeneratePassword}
                disabled={isPending}
                className="inline-flex items-center gap-2 rounded-lg border border-stone-200 px-3 py-1.5 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-100 disabled:opacity-40"
              >
                <SparklesIcon />
                Generate
              </button>
            </div>
            <input
              id="edit-user-password"
              type="text"
              value={passwordValue}
              onChange={(event) => setPasswordValue(event.target.value)}
              disabled={isPending}
              className="w-full rounded-lg border border-stone-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-stone-500 disabled:opacity-50 disabled:bg-stone-50"
              placeholder="Enter a new password"
            />
            {modalError && (
              <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                {modalError}
              </p>
            )}
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  if (!isPending) {
                    setPasswordEditorUser(null);
                    setModalError("");
                  }
                }}
                disabled={isPending}
                className="rounded-xl border border-stone-200 px-4 py-2.5 text-sm font-semibold text-stone-600 transition-colors hover:bg-stone-100 disabled:opacity-40"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSavePassword}
                disabled={isPending}
                className="rounded-xl bg-stone-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-stone-700 disabled:opacity-40"
              >
                {isPending ? "Saving..." : "Update password"}
              </button>
            </div>
          </div>
        </ModalFrame>
      )}

      {deleteUserState && (
        <ModalFrame
          title="Delete user"
          description="Are you sure? You cannot undo this action."
          isPending={isPending}
          onClose={() => {
            if (!isPending) {
              setDeleteUserState(null);
              setModalError("");
            }
          }}
        >
          <div className="space-y-5">
            <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-4 text-sm text-red-700">
              This will permanently delete {deleteUserState.email}.
            </div>
            {modalError && (
              <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                {modalError}
              </p>
            )}
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  if (!isPending) {
                    setDeleteUserState(null);
                    setModalError("");
                  }
                }}
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
        </ModalFrame>
      )}
    </>
  );
}
