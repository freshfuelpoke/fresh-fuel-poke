import Image from "next/image";
import { SiteHeader } from "@/components/restaurant/site-header";
import { getMenuCategories, getRestaurantInfo } from "@/lib/data";

type NutritionalInfo = {
  calories: string;
  protein: string;
  fats: string;
  carbs: string;
  vitaminC: string;
};

type Dish = {
  name: string;
  image: string;
  benefits?: string;
  servedWith?: string;
  nutrition?: NutritionalInfo;
};

type AddOn = {
  name: string;
  weight: string;
  image: string;
  nutrition?: NutritionalInfo;
};

const pokeBowls: Dish[] = [
  {
    name: "Bliss",
    image: "https://utfs.io/f/f5g7m1aw2QJCHcKB1rgaPSjbgwLZMdvhyz268nAmXYVBErlo",
    benefits: "Inflammation Control, Metabolic Support, Muscle Recovery",
    servedWith:
      "Quinoa, Chicken, Spinach, Kale, Edamame, Carrot, Cucumber, Pineapple, Avocado, Sesame Seed, Ginger, Seaweed",
    nutrition: {
      calories: "525.04g",
      protein: "37.6g",
      fats: "22.44g",
      carbs: "44.78g",
      vitaminC: "58.46mg",
    },
  },
  {
    name: "Low Calories",
    image: "https://utfs.io/f/f5g7m1aw2QJC1iGUTW9uMX2P4g7DIHFtn6oSr5iKacQL9sAU",
    benefits: "Big Portion, Low Calories, Satiety, Metabolism Booster",
    servedWith:
      "Spinach, Salmon, Purple Cabbage, Cucumber, Ginger, Sesame Oil, Sesame Seed",
    nutrition: {
      calories: "349.53g",
      protein: "26.01g",
      fats: "22.4g",
      carbs: "13.04g",
      vitaminC: "73.25mg",
    },
  },
  {
    name: "Gut Guardian",
    image: "https://utfs.io/f/f5g7m1aw2QJC5lVbkxzeyYWf6m0OvIax7QAGc5tUgrqRh3w1",
    benefits: "Microbiome Support, Digestive Comfort, Complete Nutrition",
    servedWith:
      "Quinoa, Tofu, Edamame, Kimchi, Cucumber, Carrot, Purple Cabbage",
    nutrition: {
      calories: "369.95g",
      protein: "27.65g",
      fats: "13.42g",
      carbs: "40.05g",
      vitaminC: "48.21mg",
    },
  },
  {
    name: "Muscle Recovery",
    image: "https://utfs.io/f/f5g7m1aw2QJCYcR6bH1EvDfeMyxaCKdpFl2uRb5jWcBJNGAT",
    benefits:
      "Lean Protein, Inflammation Defense, Recovery Carb Blend (Glycogen Restore)",
    servedWith:
      "Quinoa, Chicken, Edamame, Carrot, Cucumber, Ginger, Coconut, Lemon, Wasabi, Sesame Seed",
    nutrition: {
      calories: "409.52g",
      protein: "30.93g",
      fats: "39.31g",
      carbs: "55.75g",
      vitaminC: "14.73mg",
    },
  },
  {
    name: "Neuro Fuel",
    image: "https://utfs.io/f/f5g7m1aw2QJCdJ4NH9TUXQ2g4zFsNfvVYqxiHanuLb8ZTktm",
    benefits: "Brain Power, Heart Protection, Focus Fuel",
    servedWith:
      "Quinoa, Salmon, Avocado, Cucumber, Bell Pepper, Lollo Rosso, Almond, Sesame Oil",
    nutrition: {
      calories: "577.33g",
      protein: "29.5g",
      fats: "35.13g",
      carbs: "30.16g",
      vitaminC: "30.17mg",
    },
  },
  {
    name: "Immunity Booster",
    image: "https://utfs.io/f/f5g7m1aw2QJC9u5l78XYjgaZBPVG48XwnAtOd2vRJ9Wzom5f",
    benefits: "Virus Shield, White Blood Cell Boost, Mucous Membrane Armor",
    servedWith:
      "Quinoa, Salmon, Kale, Ginger Pickled, Carrot, Cilantro, Garlic, Sesame Seed",
    nutrition: {
      calories: "420.82g",
      protein: "29.36g",
      fats: "18.46g",
      carbs: "30.87g",
      vitaminC: "102.49mg",
    },
  },
  {
    name: "Fuel Up Energy",
    image: "https://utfs.io/f/f5g7m1aw2QJCRldEU8Q5meEpF1ha2V3juf74twPWUrMnYGJd",
    benefits: "Instant fuel, Sustained Power, Crash Protection",
    servedWith:
      "Quinoa, Sweet Potato, Salmon, Avocado, Edamame, Cucumber, Purple Cabbage, Ginger Pickled, Wasabi, Sesame Seed",
    nutrition: {
      calories: "559.32g",
      protein: "34.39g",
      fats: "28.23g",
      carbs: "44.07g",
      vitaminC: "58.46mg",
    },
  },
  {
    name: "Cardio Crunch",
    image: "https://utfs.io/f/f5g7m1aw2QJCpVXthYKvmhIOVdTq9Hg7F10spSPvaZ2UeKAo",
    benefits: "Cholesterol Control, Clean Energy, Circulation Support",
    servedWith:
      "Quinoa, Salmon, Broccoli, Avocado, Lemon (Wedge), Dry Fruits, Flax Seed, Olive Oil",
    nutrition: {
      calories: "530.51g",
      protein: "29.78g",
      fats: "30.41g",
      carbs: "5.21g",
      vitaminC: "51.67mg",
    },
  },
];

const addOns: AddOn[] = [
  {
    name: "Salmon Fillet",
    weight: "120 gram",
    image: "https://utfs.io/f/f5g7m1aw2QJCBsXuYzxv0Uion2XTsYp86xIZAqrGjhE9bdlk",
    nutrition: {
      calories: "170.4 g",
      protein: "23.81 g",
      fats: "7.61 g",
      carbs: "0 g",
      vitaminC: "0 mg",
    },
  },
  {
    name: "Avocado",
    weight: "80 gram",
    image: "https://utfs.io/f/f5g7m1aw2QJCiaR1UXypa83G1Pz5A2iBmgxMkfHJQdwvSsn4",
    nutrition: {
      calories: "136.8 g",
      protein: "1.60 g",
      fats: "12.24 g",
      carbs: "5.92 g",
      vitaminC: "6.40 mg",
    },
  },
  {
    name: "Chicken Breast",
    weight: "120 gram",
    image: "https://utfs.io/f/f5g7m1aw2QJC91eigaXYjgaZBPVG48XwnAtOd2vRJ9Wzom5f",
    nutrition: {
      calories: "159.6 g",
      protein: "23.8 g",
      fats: "6 g",
      carbs: "3 g",
      vitaminC: "0 mg",
    },
  },
  {
    name: "Tofu",
    weight: "120 gram",
    image: "https://utfs.io/f/f5g7m1aw2QJCMBBkk7Bc5UcXDiTvp2R3zVZ4lhyt7bQAfFg1",
    nutrition: {
      calories: "136.8 g",
      protein: "14.51 g",
      fats: "8.6 g",
      carbs: "3.38 g",
      vitaminC: "0.18 mg",
    },
  },
  {
    name: "Kimchi",
    weight: "120 gram",
    image: "https://utfs.io/f/f5g7m1aw2QJCtubTyoY8NsfMLa4ETYtdhP1rUD9wXGzKymAc",
    nutrition: {
      calories: "22.5 g",
      protein: "1.2 g",
      fats: "0.08 g",
      carbs: "4.26 g",
      vitaminC: "52 mg",
    },
  },
  {
    name: "Apple & Pineapple Mix",
    weight: "80 gram",
    image: "https://utfs.io/f/f5g7m1aw2QJCb8I1yETlyRnQJX7E16C0jWPBYpLqHUdaGKrf",
    nutrition: {
      calories: "37.2 g",
      protein: "0.48 g",
      fats: "0.2 g",
      carbs: "9 g",
      vitaminC: "8 mg",
    },
  },
];

const sauces: AddOn[] = [
  {
    name: "Honey Lime",
    weight: "30 gram",
    image: "https://utfs.io/f/f5g7m1aw2QJC9rNwepXYjgaZBPVG48XwnAtOd2vRJ9Wzom5f",
  },
  {
    name: "Ginger Miso",
    weight: "30 gram",
    image: "https://utfs.io/f/f5g7m1aw2QJCO2BS9CGmUHbqatNvClAcrwigzPS4JQexo3E5",
  },
  {
    name: "Ponzu Tajin",
    weight: "30 gram",
    image: "https://utfs.io/f/f5g7m1aw2QJC0r1egI6jpDXZOHmbCsiu25MafRVLShNK7vWx",
  },
  {
    name: "Turmeric Coco",
    weight: "30 gram",
    image: "https://utfs.io/f/f5g7m1aw2QJCifJ7sOypa83G1Pz5A2iBmgxMkfHJQdwvSsn4",
  },
];

const NutritionTable = ({ nutrition, isRightAligned }: { nutrition: NutritionalInfo, isRightAligned: boolean }) => (
  <div className="mt-4 w-full sm:w-[300px] border-b-2 border-dotted border-[#cf3328] pb-1">
    <div className={`grid grid-cols-[auto_auto] gap-x-4 gap-y-0 text-sm font-semibold text-[#cf3328] w-fit ${isRightAligned ? "mr-auto" : "ml-auto"}`}>
      <span className={isRightAligned ? "text-left" : "text-right"}>Calories</span>
      <span className="text-right">{nutrition.calories}</span>
      <span className={isRightAligned ? "text-left" : "text-right"}>Protein</span>
      <span className="text-right">{nutrition.protein}</span>
      <span className={isRightAligned ? "text-left" : "text-right"}>Fats</span>
      <span className="text-right">{nutrition.fats}</span>
      <span className={isRightAligned ? "text-left" : "text-right"}>Carbs</span>
      <span className="text-right">{nutrition.carbs}</span>
      <span className={isRightAligned ? "text-left" : "text-right"}>Vitamin C</span>
      <span className="text-right">{nutrition.vitaminC}</span>
    </div>
  </div>
);

export default async function CateringPage() {
  const [menuCategories, restaurantInfo] = await Promise.all([
    getMenuCategories(),
    getRestaurantInfo(),
  ]);

  return (
    <>
      <SiteHeader menuCategories={menuCategories} logo={restaurantInfo.logo} />
      <div className="min-h-screen bg-[#7ccfec] pb-20 overflow-hidden relative font-sans">
        {/* Background base */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#aae4f5] via-[#75cdec] to-[#4abce3] pointer-events-none" />

        {/* Wavy subtle gradients for organic feel */}
        <div className="absolute top-[-20%] left-[-10%] w-[120%] h-[60%] rounded-[100%] bg-gradient-to-b from-white/30 to-transparent pointer-events-none blur-3xl transform -rotate-12" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[120%] h-[60%] rounded-[100%] bg-gradient-to-t from-white/30 to-transparent pointer-events-none blur-3xl transform rotate-12" />

        {/* Halftone dot pattern overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.45] mix-blend-overlay"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.9) 1.5px, transparent 0)`,
            backgroundSize: "8px 8px",
          }}
        />

        <div className="max-w-5xl mx-auto px-6 pt-32 relative z-10">
          <h1 className="text-5xl md:text-7xl font-black text-center text-[#cf3328] mb-20 uppercase tracking-wide">
            Poke Bowl
          </h1>

          <div className="space-y-24 md:space-y-32">
            {pokeBowls.map((dish, index) => {
              const isEven = index % 2 === 0;
              return (
                <div
                  key={dish.name}
                  className={`flex flex-col md:flex-row items-center gap-8 md:gap-16 ${isEven ? "" : "md:flex-row-reverse"
                    }`}
                >
                  {/* Image */}
                  <div className="w-full md:w-1/2 flex justify-center">
                    <div className="relative w-64 h-64 md:w-96 md:h-96 drop-shadow-[0_15px_15px_rgba(0,0,0,0.3)]">
                      <Image
                        src={dish.image}
                        alt={dish.name}
                        fill
                        className="object-contain"
                        unoptimized
                      />
                    </div>
                  </div>

                  {/* Details */}
                  <div
                    className={`w-full md:w-1/2 flex flex-col ${isEven
                      ? "md:items-start md:text-left"
                      : "md:items-end md:text-right"
                      } items-center text-center`}
                  >
                    <h2 className="text-4xl md:text-5xl font-black text-[#cf3328] mb-4">
                      {dish.name}
                    </h2>

                    <div className="space-y-4 max-w-xl">
                      <p className="text-base md:text-lg font-bold text-[#cf3328] leading-snug">
                        Key Benefits:{" "}
                        <span className="font-semibold">{dish.benefits}</span>
                      </p>
                      <p className="text-base md:text-lg font-bold text-[#cf3328] leading-snug">
                        Served with :{" "}
                        <span className="font-semibold">{dish.servedWith}</span>
                      </p>
                    </div>

                    {dish.nutrition && (
                      <div
                        className={`flex w-full ${isEven ? "justify-center md:justify-start" : "justify-center md:justify-end"}`}
                      >
                        <NutritionTable nutrition={dish.nutrition} isRightAligned={isEven} />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Add Ons Section */}
          <div className="mt-32">
            <h2 className="text-5xl md:text-6xl font-black text-center text-[#cf3328] mb-20 uppercase tracking-wide">
              ADD ONS
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
              {addOns.map((addon, index) => {
                const isRightColumn = index % 2 !== 0;
                return (
                  <div key={addon.name} className={`flex items-center gap-4 ${isRightColumn ? "flex-row-reverse" : ""}`}>
                    <div className="relative w-24 h-24 md:w-32 md:h-32 shrink-0 drop-shadow-[0_10px_10px_rgba(0,0,0,0.25)]">
                      <Image
                        src={addon.image}
                        alt={addon.name}
                        fill
                        className="object-contain"
                        unoptimized
                      />
                    </div>
                    <div className={`flex-1 flex flex-col justify-center ${isRightColumn ? "items-end text-right" : "items-start text-left"}`}>
                      <h3 className="text-xl md:text-2xl font-black text-[#cf3328] mb-1">
                        {addon.name}{" "}
                        <span className="text-sm font-semibold text-[#cf3328]">
                          ({addon.weight})
                        </span>
                      </h3>
                      {addon.nutrition && (
                        <div className="w-full border-b-2 border-dotted border-[#cf3328] pb-1 mt-1">
                          <div className={`grid grid-cols-[auto_auto] gap-x-3 gap-y-0 text-xs font-semibold text-[#cf3328] w-fit ${isRightColumn ? "ml-auto" : "mr-auto"}`}>
                            <span className="text-left">Calories</span>
                            <span className="text-right">{addon.nutrition.calories}</span>
                            <span className="text-left">Protein</span>
                            <span className="text-right">{addon.nutrition.protein}</span>
                            <span className="text-left">Fats</span>
                            <span className="text-right">{addon.nutrition.fats}</span>
                            <span className="text-left">Carbs</span>
                            <span className="text-right">{addon.nutrition.carbs}</span>
                            <span className="text-left">Vitamin C</span>
                            <span className="text-right">{addon.nutrition.vitaminC}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sauces Section */}
          <div className="mt-32 pb-20">
            <h2 className="text-5xl md:text-6xl font-black text-center text-[#cf3328] mb-20 uppercase tracking-wide">
              Sauce
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-0">
              {sauces.map((sauce) => (
                <div key={sauce.name} className="flex items-center -my-6 md:-my-10">
                  <div className="relative w-48 h-48 md:w-64 md:h-64 shrink-0 drop-shadow-[0_10px_10px_rgba(0,0,0,0.25)]">
                    <Image
                      src={sauce.image}
                      alt={sauce.name}
                      fill
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                  <div className="flex-1 min-w-0 -ml-8 md:-ml-16 z-10 relative">
                    <h3 className="flex items-baseline whitespace-nowrap text-xl md:text-2xl font-black text-[#cf3328] pb-2 border-b-2 border-dotted border-[#cf3328] w-fit pr-8">
                      {sauce.name}
                      <span className="ml-2 text-sm font-semibold text-[#cf3328]">
                        ({sauce.weight})
                      </span>
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
