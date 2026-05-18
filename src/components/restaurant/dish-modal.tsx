"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export type DishNutrition = {
  calories: number | string;
  protein: number | string;
  fats: number | string;
  carbs: number | string;
  vitC: string;
};

export type DishDetails = {
  name: string;
  image: string;
  description: string;
  subtitle?: string;
  ingredients?: string;
  nutrition?: DishNutrition;
  price?: string;
  isSignature?: boolean;
  category?: string;
};

type DishModalProps = {
  isOpen: boolean;
  onClose: () => void;
  bowl: DishDetails | null;
};

export function DishModal({ isOpen, onClose, bowl }: DishModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || !bowl || !mounted) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-sm">
      <button
        type="button"
        className="absolute inset-0"
        onClick={onClose}
        aria-label="Close modal"
      />
      <div
        className={`bg-white border border-stone-100 shadow-2xl w-full ${
          bowl.isSignature
            ? "max-w-6xl"
            : bowl.category === "sauce"
              ? "max-w-xs"
              : "max-w-sm"
        } max-h-[95vh] relative flex flex-col rounded-sm overflow-hidden`}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 md:top-5 md:right-5 z-20 bg-white/60 backdrop-blur-md rounded-full text-stone-400 hover:text-stone-900 transition-colors p-2 shadow-sm md:shadow-none md:bg-transparent"
          aria-label="Close modal"
        >
          <svg
            aria-hidden="true"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div
          className={`flex flex-col ${bowl.isSignature ? "md:flex-row" : "items-center text-center"} w-full overflow-y-auto p-6 md:p-10 lg:p-14`}
        >
          {/* Non-signature: Name at top */}
          {!bowl.isSignature && (
            <h2 className="text-[28px] font-medium text-stone-800 mb-5 font-sans leading-tight w-full text-center">
              {bowl.name}
            </h2>
          )}

          {/* Image */}
          <div
            className={`${bowl.isSignature ? "flex-1 border-b md:border-b-0 md:border-r border-stone-300 md:pr-14" : "w-full mb-6"} flex flex-col items-center justify-center shrink-0`}
          >
            <div
              className={`relative ${bowl.isSignature ? "w-64 h-64 sm:w-80 sm:h-80 md:w-144 md:h-144" : "w-56 h-56 sm:w-72 sm:h-72"}`}
            >
              <Image
                src={bowl.image}
                alt={bowl.name}
                fill
                className="object-contain"
              />
            </div>
          </div>

          {/* Right Side (signature) / Bottom: Content */}
          <div
            className={`${bowl.isSignature ? "flex-1 pt-6 md:pt-0 md:pl-10" : "w-full"} flex flex-col justify-center`}
          >
            {bowl.isSignature && (
              <h2 className="text-[32px] font-medium text-stone-800 mb-3 font-sans leading-tight">
                {bowl.name}
              </h2>
            )}

            {bowl.isSignature && (
              <>
                {bowl.description && (
                  <p className="text-stone-400 mb-3 leading-snug text-[17px] font-medium italic">
                    {bowl.description}
                  </p>
                )}
                <p className="text-stone-400 mb-4 leading-snug text-[17px]">
                  {bowl.ingredients}
                </p>

                <div className="mb-6 md:mb-8">
                  <h3 className="text-stone-400 underline decoration-stone-400 underline-offset-[6px] mb-3 md:mb-4 text-[16px] md:text-[17px] font-medium">
                    Nutrients Facts
                  </h3>
                  <div className="space-y-0.5 text-[14px] md:text-[15px] font-medium text-stone-400 tracking-wide uppercase">
                    <p>CALORIES {bowl.nutrition?.calories || "--"}</p>
                    <p>PROTEIN {bowl.nutrition?.protein || "--"}</p>
                    <p>FATS {bowl.nutrition?.fats || "--"}</p>
                    <p>CARBS {bowl.nutrition?.carbs || "--"}</p>
                    <p>VIT C {bowl.nutrition?.vitC || "--"}</p>
                  </div>
                </div>
              </>
            )}

            <div className="mb-6">
              <p className="text-[20px] font-medium text-stone-800">
                Price Per Bowl: HKD {bowl.price || "98"}
              </p>
            </div>

            {bowl.isSignature && (
              <div className="mb-6">
                <h4 className="text-stone-400 text-[18px] mb-3">
                  Sauce Option
                </h4>
                <ul className="grid grid-cols-2 gap-x-1 gap-y-1 max-w-fit">
                  {[
                    "Ginger Miso",
                    "Honey Lime",
                    "Ponzu Tajin",
                    "Turmeric Coco",
                  ].map((sauce) => (
                    <li
                      key={sauce}
                      className="flex items-center gap-2 text-stone-400 text-[16px] font-medium pr-1"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-black" />
                      {sauce}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div
              className={`flex flex-row gap-3 sm:gap-4 mt-auto pt-4 ${bowl.isSignature ? "md:pt-0" : "justify-center"}`}
            >
              <button
                type="button"
                className="flex-1 sm:flex-none bg-[#e7cd61] hover:bg-[#d6bc53] text-stone-900 font-semibold py-1 px-3 md:py-1.5 md:px-4 rounded shadow-sm transition-colors text-[14px] md:text-[15px]"
              >
                Dine-In
              </button>
              <button
                type="button"
                className="flex-1 sm:flex-none bg-[#e7cd61] hover:bg-[#d6bc53] text-stone-900 font-semibold py-1 px-3 md:py-1.5 md:px-4 rounded shadow-sm transition-colors text-[14px] md:text-[15px]"
              >
                Delivery
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
