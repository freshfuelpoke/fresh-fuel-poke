"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";
import {
  addMenuItem,
  deleteMenuCategory,
  deleteMenuItem,
  updateMenuItem,
} from "@/app/actions/admin";
import { UploadButton } from "@/utils/uploadthing";

type Item = {
  id: number;
  name: string;
  price: string;
  image: string | null;
  categoryId: number;
  displayOrder: number;
};

type Category = {
  id: number;
  title: string;
  note: string | null;
  isDineIn: boolean;
  displayOrder: number;
  items: Item[];
};

type EditorState =
  | { mode: "create"; categoryId: number }
  | { mode: "edit"; categoryId: number; item: Item };

type DeleteState =
  | { type: "item"; categoryId: number; itemId: number; label: string }
  | { type: "category"; categoryId: number; label: string };

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
      <div className="w-full max-w-xl rounded-[28px] border border-stone-200 bg-white shadow-2xl">
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

export function MenuManager({
  categoriesWithItems,
}: {
  categoriesWithItems: Category[];
}) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>(categoriesWithItems);
  const [openCatId, setOpenCatId] = useState<number | null>(
    categoriesWithItems[0]?.id ?? null,
  );
  const [editorState, setEditorState] = useState<EditorState | null>(null);
  const [deleteState, setDeleteState] = useState<DeleteState | null>(null);
  const [formError, setFormError] = useState("");
  const [modalImageUrl, setModalImageUrl] = useState("");
  const [nameValue, setNameValue] = useState("");
  const [priceValue, setPriceValue] = useState("");
  const [isPending, startTransition] = useTransition();

  const activeCategory = useMemo(
    () => categories.find((category) => category.id === openCatId),
    [categories, openCatId],
  );

  useEffect(() => {
    if (!editorState) {
      setNameValue("");
      setPriceValue("");
      setModalImageUrl("");
      setFormError("");
      return;
    }

    if (editorState.mode === "edit") {
      setNameValue(editorState.item.name);
      setPriceValue(editorState.item.price);
      setModalImageUrl(editorState.item.image ?? "");
      setFormError("");
      return;
    }

    setNameValue("");
    setPriceValue("");
    setModalImageUrl("");
    setFormError("");
  }, [editorState]);

  function openCreateModal(categoryId: number) {
    setEditorState({ mode: "create", categoryId });
  }

  function openEditModal(categoryId: number, item: Item) {
    setEditorState({ mode: "edit", categoryId, item });
  }

  function closeEditorModal() {
    if (isPending) return;
    setEditorState(null);
  }

  function openDeleteItemDialog(categoryId: number, item: Item) {
    setDeleteState({
      type: "item",
      categoryId,
      itemId: item.id,
      label: item.name,
    });
  }

  function openDeleteCategoryDialog(categoryId: number, label: string) {
    setDeleteState({
      type: "category",
      categoryId,
      label,
    });
  }

  function closeDeleteDialog() {
    if (isPending) return;
    setDeleteState(null);
  }

  function handleSubmitItem() {
    if (!editorState) return;

    const trimmedName = nameValue.trim();
    const trimmedPrice = priceValue.trim();
    const trimmedImage = modalImageUrl.trim();

    if (!trimmedName || !trimmedPrice) {
      setFormError("Name and price are required.");
      return;
    }

    if (!trimmedImage) {
      setFormError("Please upload an image before saving.");
      return;
    }

    setFormError("");
    const formData = new FormData();
    formData.set("name", trimmedName);
    formData.set("price", trimmedPrice);
    formData.set("image", trimmedImage);

    if (editorState.mode === "create") {
      formData.set("categoryId", String(editorState.categoryId));
      startTransition(async () => {
        const res = await addMenuItem(formData);

        if (res?.error) {
          setFormError(res.error);
          return;
        }

        setCategories((prev) =>
          prev.map((category) =>
            category.id === editorState.categoryId
              ? {
                  ...category,
                  items: [
                    ...category.items,
                    {
                      id: Date.now(),
                      categoryId: editorState.categoryId,
                      name: trimmedName,
                      price: trimmedPrice,
                      image: trimmedImage,
                      displayOrder: category.items.length,
                    },
                  ],
                }
              : category,
          ),
        );
        setEditorState(null);
      });
      return;
    }

    formData.set("id", String(editorState.item.id));
    startTransition(async () => {
      const res = await updateMenuItem(formData);

      if (res?.error) {
        setFormError(res.error);
        return;
      }

      setCategories((prev) =>
        prev.map((category) =>
          category.id === editorState.categoryId
            ? {
                ...category,
                items: category.items.map((item) =>
                  item.id === editorState.item.id
                    ? {
                        ...item,
                        name: trimmedName,
                        price: trimmedPrice,
                        image: trimmedImage,
                      }
                    : item,
                ),
              }
            : category,
        ),
      );
      setEditorState(null);
    });
  }

  function handleConfirmDelete() {
    if (!deleteState) return;

    startTransition(async () => {
      if (deleteState.type === "item") {
        await deleteMenuItem(deleteState.itemId);
        setCategories((prev) =>
          prev.map((category) =>
            category.id === deleteState.categoryId
              ? {
                  ...category,
                  items: category.items.filter(
                    (item) => item.id !== deleteState.itemId,
                  ),
                }
              : category,
          ),
        );
        setDeleteState(null);
        router.refresh();
        return;
      }

      await deleteMenuCategory(deleteState.categoryId);
      setCategories((prev) =>
        prev.filter((category) => category.id !== deleteState.categoryId),
      );
      if (openCatId === deleteState.categoryId) {
        const remaining = categories.filter(
          (category) => category.id !== deleteState.categoryId,
        );
        setOpenCatId(remaining[0]?.id ?? null);
      }
      setDeleteState(null);
      router.refresh();
    });
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[280px_1fr]">
        <div className="space-y-3">
          <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
            <div className="border-b border-stone-100 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-stone-400">
                Categories
              </p>
            </div>
            <ul className="divide-y divide-stone-100">
              {categories.map((category) => (
                <li
                  key={category.id}
                  className={`flex items-center gap-2 px-4 py-3 transition-colors ${
                    openCatId === category.id
                      ? "bg-stone-900 text-white"
                      : "text-stone-700 hover:bg-stone-50"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenCatId(category.id)}
                    className="flex-1 text-left"
                  >
                    <p className="text-sm font-medium">{category.title}</p>
                    <p className="mt-0.5 text-xs text-stone-400">
                      {category.items.length} item
                      {category.items.length !== 1 ? "s" : ""}
                    </p>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      openDeleteCategoryDialog(category.id, category.title)
                    }
                    disabled={isPending}
                    aria-label={`Delete ${category.title}`}
                    className={`rounded-md p-1 transition-colors disabled:opacity-40 ${
                      openCatId === category.id
                        ? "text-stone-400 hover:bg-white/10 hover:text-red-300"
                        : "text-stone-300 hover:bg-stone-100 hover:text-red-400"
                    }`}
                  >
                    <TrashIcon />
                  </button>
                </li>
              ))}
              {categories.length === 0 && (
                <li className="px-4 py-6 text-center text-sm italic text-stone-400">
                  No categories yet.
                </li>
              )}
            </ul>
          </div>

          {/* Add Category
          <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
            ...
          </div>
          */}
        </div>

        <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
          {activeCategory ? (
            <>
              <div className="flex items-start justify-between gap-4 border-b border-stone-100 px-6 py-5">
                <div>
                  <h2 className="font-semibold text-stone-800">
                    {activeCategory.title}
                  </h2>
                  {activeCategory.note && (
                    <p className="mt-0.5 text-xs text-stone-400">
                      {activeCategory.note}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => openCreateModal(activeCategory.id)}
                  disabled={isPending}
                  className="rounded-xl bg-stone-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-stone-700 disabled:opacity-40"
                >
                  Add item
                </button>
              </div>

              <div className="p-6">
                {activeCategory.items.length > 0 ? (
                  <div className="space-y-2">
                    {activeCategory.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between gap-4 rounded-xl border border-stone-100 bg-stone-50 px-4 py-3"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-stone-200 bg-stone-100">
                            {item.image ? (
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                sizes="56px"
                                className="object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-[10px] uppercase tracking-[0.18em] text-stone-300">
                                No image
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-stone-800">
                              {item.name}
                            </p>
                            <p className="text-xs text-stone-400">
                              {item.price}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() =>
                              openEditModal(activeCategory.id, item)
                            }
                            disabled={isPending}
                            aria-label={`Edit ${item.name}`}
                            className="rounded-md p-2 text-stone-400 transition-colors hover:bg-stone-200 hover:text-stone-700 disabled:opacity-40"
                          >
                            <EditIcon />
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              openDeleteItemDialog(activeCategory.id, item)
                            }
                            disabled={isPending}
                            aria-label={`Delete ${item.name}`}
                            className="rounded-md p-2 text-stone-400 transition-colors hover:bg-stone-200 hover:text-red-500 disabled:opacity-40"
                          >
                            <TrashIcon />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    <p className="mb-2 text-2xl">🥢</p>
                    <p className="text-sm italic text-stone-400">
                      No items in this category yet.
                    </p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex h-60 flex-col items-center justify-center">
              <p className="mb-3 text-2xl">👈</p>
              <p className="text-sm italic text-stone-400">
                Select a category to view and manage its items.
              </p>
            </div>
          )}
        </div>
      </div>

      {editorState && (
        <ModalFrame
          title={
            editorState.mode === "create" ? "Add menu item" : "Edit menu item"
          }
          description={
            editorState.mode === "create"
              ? "Create a new item for this category."
              : "Update the item name, price, or image."
          }
          isPending={isPending}
          onClose={closeEditorModal}
        >
          <div className="space-y-5">
            <div>
              <p className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-stone-400">
                Item image
              </p>
              {modalImageUrl ? (
                <div className="relative overflow-hidden rounded-2xl border border-stone-200 bg-stone-50">
                  <div className="relative aspect-[4/3] w-full">
                    <Image
                      src={modalImageUrl}
                      alt="Menu item preview"
                      fill
                      sizes="(max-width: 768px) 100vw, 480px"
                      className="object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setModalImageUrl("")}
                    className="absolute right-3 top-3 rounded-full bg-black/70 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-black"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="rounded-2xl border-2 border-dashed border-stone-200 bg-stone-50 p-5">
                  <UploadButton
                    endpoint="menuImageUploader"
                    onClientUploadComplete={(res) => {
                      if (res?.[0]?.url) {
                        setModalImageUrl(res[0].url);
                        setFormError("");
                        return;
                      }
                      setFormError("Upload did not return a valid image URL.");
                    }}
                    onUploadError={(error) => setFormError(error.message)}
                    appearance={{
                      button:
                        "rounded-xl bg-stone-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-stone-700 ut-readying:bg-stone-500 ut-uploading:bg-stone-500",
                      allowedContent: "hidden",
                    }}
                    content={{
                      button: "Change image",
                      allowedContent: null,
                    }}
                  />
                </div>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-[1fr_140px]">
              <div>
                <label
                  htmlFor="menu-item-name"
                  className="mb-1 block text-xs font-semibold uppercase tracking-[0.12em] text-stone-400"
                >
                  Name
                </label>
                <input
                  id="menu-item-name"
                  type="text"
                  value={nameValue}
                  onChange={(event) => setNameValue(event.target.value)}
                  disabled={isPending}
                  placeholder="e.g. Bliss Bowl"
                  className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-800 transition-all focus:border-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-900/20 disabled:opacity-50"
                />
              </div>
              <div>
                <label
                  htmlFor="menu-item-price"
                  className="mb-1 block text-xs font-semibold uppercase tracking-[0.12em] text-stone-400"
                >
                  Price
                </label>
                <input
                  id="menu-item-price"
                  type="text"
                  value={priceValue}
                  onChange={(event) => setPriceValue(event.target.value)}
                  disabled={isPending}
                  placeholder="98"
                  className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-800 transition-all focus:border-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-900/20 disabled:opacity-50"
                />
              </div>
            </div>

            {formError && (
              <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                {formError}
              </p>
            )}

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={closeEditorModal}
                disabled={isPending}
                className="rounded-xl border border-stone-200 px-4 py-2.5 text-sm font-semibold text-stone-600 transition-colors hover:bg-stone-100 disabled:opacity-40"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmitItem}
                disabled={isPending}
                className="rounded-xl bg-stone-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-stone-700 disabled:opacity-40"
              >
                {isPending
                  ? "Saving..."
                  : editorState.mode === "create"
                    ? "Add item"
                    : "Save changes"}
              </button>
            </div>
          </div>
        </ModalFrame>
      )}

      {deleteState && (
        <ModalFrame
          title="Confirm delete"
          description="Are you sure? You cannot undo this action."
          isPending={isPending}
          onClose={closeDeleteDialog}
        >
          <div className="space-y-5">
            <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-4 text-sm text-red-700">
              {deleteState.type === "item"
                ? `This will permanently delete ${deleteState.label}.`
                : `This will permanently delete ${deleteState.label} and all of its items.`}
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
        </ModalFrame>
      )}
    </>
  );
}
