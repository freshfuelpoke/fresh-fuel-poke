"use client";

import Image from "next/image";
import { useEffect, useState, useTransition } from "react";
import { updateHeroSlide } from "@/app/actions/admin";
import { UploadButton } from "@/utils/uploadthing";

type Slide = {
  id: number;
  src: string;
  alt: string | null;
  label: string | null;
  titleLine1: string;
  titleLine2: string | null;
  accent: string | null;
  description: string;
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

export function SlidesManager({ slides: initialSlides }: { slides: Slide[] }) {
  const [slides, setSlides] = useState<Slide[]>(initialSlides);
  const [activeSlide, setActiveSlide] = useState<Slide | null>(null);
  const [formError, setFormError] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [labelValue, setLabelValue] = useState("");
  const [accentValue, setAccentValue] = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!activeSlide) {
      setImageUrl("");
      setLabelValue("");
      setAccentValue("");
      setFormError("");
      return;
    }

    setImageUrl(activeSlide.src);
    setLabelValue(activeSlide.label ?? "");
    setAccentValue(activeSlide.accent ?? "");
    setFormError("");
  }, [activeSlide]);

  function handleOpenEdit(slide: Slide) {
    setActiveSlide(slide);
  }

  function handleCloseEdit() {
    if (isPending) return;
    setActiveSlide(null);
  }

  function handleSave() {
    if (!activeSlide) return;
    if (!imageUrl.trim()) {
      setFormError("Please upload an image before saving.");
      return;
    }

    const formData = new FormData();
    formData.set("src", imageUrl.trim());
    formData.set("alt", activeSlide.alt ?? "");
    formData.set("label", labelValue.trim());
    formData.set("titleLine1", activeSlide.titleLine1);
    formData.set("titleLine2", activeSlide.titleLine2 ?? "");
    formData.set("accent", accentValue.trim());
    formData.set("description", activeSlide.description);
    setFormError("");

    startTransition(async () => {
      const res = await updateHeroSlide(activeSlide.id, formData);

      if (res?.error) {
        setFormError(res.error);
        return;
      }

      setSlides((prev) =>
        prev.map((slide) =>
          slide.id === activeSlide.id
            ? {
                ...slide,
                src: imageUrl.trim(),
                label: labelValue.trim() || null,
                accent: accentValue.trim() || null,
              }
            : slide,
        ),
      );
      setActiveSlide(null);
    });
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className="group overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm"
          >
            <div className="relative aspect-video bg-stone-100">
              <Image
                src={slide.src}
                alt={slide.alt ?? ""}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              {slide.label && (
                <p className="absolute left-4 top-4 text-[10px] font-semibold uppercase tracking-[0.28em] text-white/80">
                  {slide.label}
                </p>
              )}
              {slide.accent && (
                <p className="absolute bottom-4 left-4 right-4 font-serif text-lg italic leading-tight text-white">
                  {slide.accent}
                </p>
              )}
              <div className="absolute right-3 top-3 rounded-full bg-black/50 px-2 py-0.5 text-xs text-white">
                Slide {index + 1}
              </div>
            </div>
            <div className="flex items-center justify-between px-4 py-4">
              <div>
                <p className="text-sm font-medium text-stone-800">
                  Slide {index + 1}
                </p>
                <p className="text-xs text-stone-400">
                  Edit slide by clicking edit button
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleOpenEdit(slide)}
                disabled={isPending}
                className="inline-flex items-center gap-2 rounded-xl border border-stone-200 px-3 py-2 text-sm font-semibold text-stone-700 transition-colors hover:bg-stone-100 hover:text-stone-900 disabled:opacity-40"
              >
                <EditIcon />
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      {activeSlide && (
        <ModalFrame
          title="Edit slide"
          description="Update the slide image, top label, and bottom accent text."
          isPending={isPending}
          onClose={handleCloseEdit}
        >
          <div className="space-y-5">
            <div>
              <p className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-stone-400">
                Slide image
              </p>
              {imageUrl ? (
                <div className="relative overflow-hidden rounded-2xl border border-stone-200 bg-stone-50">
                  <div className="relative aspect-video w-full">
                    <Image
                      src={imageUrl}
                      alt="Slide preview"
                      fill
                      sizes="(max-width: 768px) 100vw, 480px"
                      className="object-cover"
                    />
                    {labelValue && (
                      <p className="absolute left-4 top-4 text-[10px] font-semibold uppercase tracking-[0.28em] text-white/80">
                        {labelValue}
                      </p>
                    )}
                    {accentValue && (
                      <p className="absolute bottom-4 left-4 right-4 font-serif text-lg italic leading-tight text-white">
                        {accentValue}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setImageUrl("")}
                    className="absolute right-3 top-3 rounded-full bg-black/70 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-black"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="rounded-2xl border-2 border-dashed border-stone-200 bg-stone-50 p-5">
                  <UploadButton
                    endpoint="imageUploader"
                    onClientUploadComplete={(res) => {
                      if (res?.[0]?.url) {
                        setImageUrl(res[0].url);
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

            <div>
              <label
                htmlFor="slide-label"
                className="mb-1 block text-xs font-semibold uppercase tracking-[0.12em] text-stone-400"
              >
                Label
              </label>
              <input
                id="slide-label"
                type="text"
                value={labelValue}
                onChange={(event) => setLabelValue(event.target.value)}
                disabled={isPending}
                placeholder="Optional top label"
                className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-800 transition-all focus:border-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-900/20 disabled:opacity-50"
              />
            </div>

            <div>
              <label
                htmlFor="slide-accent"
                className="mb-1 block text-xs font-semibold uppercase tracking-[0.12em] text-stone-400"
              >
                Accent
              </label>
              <input
                id="slide-accent"
                type="text"
                value={accentValue}
                onChange={(event) => setAccentValue(event.target.value)}
                disabled={isPending}
                placeholder="Optional bottom accent"
                className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-800 transition-all focus:border-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-900/20 disabled:opacity-50"
              />
            </div>

            {formError && (
              <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                {formError}
              </p>
            )}

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={handleCloseEdit}
                disabled={isPending}
                className="rounded-xl border border-stone-200 px-4 py-2.5 text-sm font-semibold text-stone-600 transition-colors hover:bg-stone-100 disabled:opacity-40"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={isPending}
                className="rounded-xl bg-stone-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-stone-700 disabled:opacity-40"
              >
                {isPending ? "Saving..." : "Save changes"}
              </button>
            </div>
          </div>
        </ModalFrame>
      )}
    </>
  );
}
