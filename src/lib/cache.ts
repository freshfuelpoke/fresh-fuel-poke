export const CACHE_TAGS = {
  users: "cms:users",
  restaurantInfo: "cms:restaurant-info",
  hours: "cms:hours",
  testimonials: "cms:testimonials",
  heroSlides: "cms:hero-slides",
  menu: "cms:menu",
} as const;

export const CACHE_KEYS = {
  users: ["cms", "users"] as string[],
  restaurantInfo: ["cms", "restaurant-info"] as string[],
  hours: ["cms", "hours"] as string[],
  testimonials: ["cms", "testimonials"] as string[],
  heroSlides: ["cms", "hero-slides"] as string[],
  menuCategories: ["cms", "menu-categories"] as string[],
  menuCategoriesDineIn: ["cms", "menu-categories", "dine-in"] as string[],
} as const;

export type CacheTag = (typeof CACHE_TAGS)[keyof typeof CACHE_TAGS];
