"use client";

import Image from "next/image";
import { useState } from "react";
import { type DishDetails, DishModal } from "./dish-modal";

type MenuItem = {
  readonly name: string;
  readonly price?: string;
  readonly image?: string | null;
  readonly description?: string | null;
  readonly ingredients?: string | null;
  readonly calories?: string | null;
  readonly protein?: string | null;
  readonly fats?: string | null;
  readonly carbs?: string | null;
  readonly vitaminC?: string | null;
  readonly tags?: string | null;
};

type MenuCategory = {
  readonly title: string;
  readonly note?: string | null;
  readonly items: readonly MenuItem[];
};

export function WhatWeServe({
  menuCategories,
}: {
  menuCategories: readonly MenuCategory[];
}) {
  const [selectedItem, setSelectedItem] = useState<DishDetails | null>(null);

  const handleItemClick = (item: MenuItem, categoryTitle: string) => {
    const isSignature = categoryTitle === "Signature Bowls";
    const image =
      item.image ||
      "https://utfs.io/f/f5g7m1aw2QJCpVXthYKvmhIOVdTq9Hg7F10spSPvaZ2UeKAo";

    setSelectedItem({
      name: item.name,
      image,
      description: item.description || "",
      ingredients: item.ingredients || "",
      price: item.price ?? "98",
      isSignature,
      category: categoryTitle === "Sauce Options" ? "sauce" : undefined,
      nutrition:
        item.calories ||
        item.protein ||
        item.fats ||
        item.carbs ||
        item.vitaminC
          ? {
              calories: item.calories || "",
              protein: item.protein || "",
              fats: item.fats || "",
              carbs: item.carbs || "",
              vitC: item.vitaminC || "",
            }
          : undefined,
    });
  };

  return (
    <>
      <DishModal
        isOpen={selectedItem !== null}
        onClose={() => setSelectedItem(null)}
        bowl={selectedItem}
      />
      <div className="what-we-serve-wrapper">
        <Image
          src="https://utfs.io/f/f5g7m1aw2QJCFgrGrDifOUmqvT9308MN2xIjA14sKEcJLZkS"
          alt="Fresh Fuel Poke bowls"
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />

        <div className="what-we-serve-overlay mx-auto custom-container">
          <h2 className="what-we-serve-title">What We Serve</h2>

          <div className="what-we-serve-grid">
            {menuCategories.map((category, idx) => {
              const coconutWaterIndex = category.items.findIndex(
                (item) => item.name === "Coconut Water",
              );
              const splitIndex =
                coconutWaterIndex !== -1
                  ? coconutWaterIndex + 1
                  : Math.ceil(category.items.length / 2);

              return (
                <div
                  key={category.title}
                  className={`what-we-serve-column relative ${idx !== 0 ? "md:pl-10" : ""}`}
                >
                  {idx !== 0 && (
                    <div className="hidden md:block absolute left-0 top-[10%] bottom-[10%] w-px bg-stone-300" />
                  )}
                  <h3 className="what-we-serve-category">{category.title}</h3>

                  {category.title === "Drinks" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12">
                      <ul className="what-we-serve-list">
                        {category.items.slice(0, splitIndex).map((item) => (
                          <li key={item.name} className="what-we-serve-item">
                            <button
                              type="button"
                              className="cursor-pointer text-left"
                              onClick={() =>
                                handleItemClick(item, category.title)
                              }
                            >
                              {item.name}
                            </button>
                          </li>
                        ))}
                      </ul>
                      <ul className="what-we-serve-list">
                        {category.items.slice(splitIndex).map((item) => (
                          <li key={item.name} className="what-we-serve-item">
                            <button
                              type="button"
                              className="cursor-pointer text-left"
                              onClick={() =>
                                handleItemClick(item, category.title)
                              }
                            >
                              {item.name}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <ul className="what-we-serve-list">
                      {category.items.map((item) => (
                        <li key={item.name} className="what-we-serve-item">
                          <button
                            type="button"
                            className="cursor-pointer text-left"
                            onClick={() =>
                              handleItemClick(item, category.title)
                            }
                          >
                            {item.name}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
