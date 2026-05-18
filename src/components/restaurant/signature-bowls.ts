import type { DishDetails, DishNutrition } from "./dish-modal";

export type SignatureMenuItem = {
  readonly name: string;
  readonly price: string;
  readonly image?: string | null;
};

export type SignatureBowlMeta = {
  readonly description: string;
  readonly ingredients: string;
  readonly nutrition: DishNutrition;
  readonly tags: readonly string[];
};

export const signatureBowlMetaByName: Record<string, SignatureBowlMeta> = {
  Bliss: {
    description: "Inflammation Control, Metabolic Support, Muscle Recovery",
    ingredients:
      "Quinoa, Chicken, Spinach, Kale, Edamame, Carrot, Cucumber, Pineapple, Avocado, Sesame Seed, Ginger, Seaweed",
    nutrition: {
      calories: "565.04",
      protein: "37.3",
      fats: "23.44",
      carbs: "46.72",
      vitC: "56.46 MG",
    },
    tags: ["Best Seller", "Protein Forward"],
  },
  "Low Calories": {
    description: "Big Portion, Low Calories, Satiety, Metabolism Booster",
    ingredients:
      "Spinach, Salmon, Purple Cabbage, Cucumber, Ginger, Sesame Oil, Sesame Seed",
    nutrition: {
      calories: "340.53",
      protein: "27.51",
      fats: "22.4",
      carbs: "13.64",
      vitC: "73.25 mg",
    },
    tags: ["Light", "Low Calorie"],
  },
  "Cardio Crunch": {
    description: "Colesterol Control, Clean Energy, Circulation Support",
    ingredients:
      "Quinoa, Salmon, Broccoli, Avocado, Lemon, Dry Fruits, Flax Seed, Olive oil",
    nutrition: {
      calories: "533.41",
      protein: "29.70",
      fats: "30.41",
      carbs: "35.21",
      vitC: "51.67 MG",
    },
    tags: ["Crunchy", "Texture Rich"],
  },
  "Fuel Up Energy": {
    description: "Instant Fuel, Sustained Power, Crash Protection",
    ingredients:
      "Quinoa, Sweet Potato, Salmon, Avocado, Edamame, Cucumber, Purple Cabbage, Ginger, Wasabi, Sesame Seed",
    nutrition: {
      calories: "556.37",
      protein: "34.36",
      fats: "29.23",
      carbs: "44.07",
      vitC: "58.66 mg",
    },
    tags: ["Power Bowl", "Recovery"],
  },
  "Gut Guardian": {
    description: "Microbiome Support, Digestive Comfort, Complete Nutrition",
    ingredients:
      "Quinoa, Tofu, Edamame, Kimchi, Cucumber, Carrot, Purple Cabbage",
    nutrition: {
      calories: "283.64",
      protein: "17.06",
      fats: "13.43",
      carbs: "23.53",
      vitC: "48.21 mg",
    },
    tags: ["Probiotic", "Gut Health"],
  },
  "Neuro Fuel": {
    description: "Brain Power, Heart Protection, Focus Fuel",
    ingredients:
      "Quinoa, Salmon, Avocado, Cucumber, Bell Pepper, Lollo Rosso, Almond, Sesame Oil",
    nutrition: {
      calories: "517.53",
      protein: "28.10",
      fats: "35.19",
      carbs: "23.16",
      vitC: "70.17 mg",
    },
    tags: ["Brain Food", "Omega Rich"],
  },
  "Muscle Recovery": {
    description: "Lean Protein, Inflammation Defense, Recovery Carb Blend",
    ingredients:
      "Quinoa, Sweet Potato, Chicken, Broccoli, Purple Cabbage, Almond, Turmeric, Black Pepper, Olive oil",
    nutrition: {
      calories: "489.52",
      protein: "30.63",
      fats: "38.31",
      carbs: "58.73",
      vitC: "52.62",
    },
    tags: ["High Protein", "Post-Workout"],
  },
  "Immunity Booster": {
    description: "Virus Shield, White Blood Cell Boost, Mucous Me, Brain Armor",
    ingredients:
      "Quinoa, Salmon, Kale, Ginger, Carrot, Cilantro, Garlic, Sesame Seed",
    nutrition: {
      calories: "476.52",
      protein: "29.36",
      fats: "16.45",
      carbs: "50.87",
      vitC: "102.48 MG",
    },
    tags: ["Immunity", "Superfoods"],
  },
};

export function buildSignatureDishDetails(
  item: SignatureMenuItem,
): DishDetails | null {
  const meta = signatureBowlMetaByName[item.name];

  if (!meta || !item.image) {
    return null;
  }

  return {
    name: item.name,
    image: item.image,
    description: meta.description,
    ingredients: meta.ingredients,
    nutrition: meta.nutrition,
    price: item.price,
    isSignature: true,
  };
}
