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

const NutritionTable = ({
  nutrition,
  isRightAligned,
}: {
  nutrition: NutritionalInfo;
  isRightAligned: boolean;
}) => (
  <div className="mt-4 w-full sm:w-[300px] border-b-2 border-dotted border-[#cf3328] pb-1">
    <div
      className={`grid grid-cols-[auto_auto] gap-x-4 gap-y-0 text-sm font-semibold text-[#cf3328] w-fit ${isRightAligned ? "mr-auto" : "ml-auto"}`}
    >
      <span className={isRightAligned ? "text-left" : "text-right"}>
        Calories
      </span>
      <span className="text-right">{nutrition.calories}</span>
      <span className={isRightAligned ? "text-left" : "text-right"}>
        Protein
      </span>
      <span className="text-right">{nutrition.protein}</span>
      <span className={isRightAligned ? "text-left" : "text-right"}>Fats</span>
      <span className="text-right">{nutrition.fats}</span>
      <span className={isRightAligned ? "text-left" : "text-right"}>Carbs</span>
      <span className="text-right">{nutrition.carbs}</span>
      <span className={isRightAligned ? "text-left" : "text-right"}>
        Vitamin C
      </span>
      <span className="text-right">{nutrition.vitaminC}</span>
    </div>
  </div>
);

export default async function CateringPage() {
  const [menuCategories, restaurantInfo] = await Promise.all([
    getMenuCategories(),
    getRestaurantInfo(),
  ]);

  const pokeBowls =
    menuCategories.find((c) => c.title === "Signature Bowls")?.items || [];
  const addOns =
    menuCategories.find((c) => c.title === "Add On Side Dish")?.items || [];
  const sauces =
    menuCategories.find((c) => c.title === "Sauce Options")?.items || [];

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

        <div className="max-w-6xl mx-auto px-6 pt-32 relative z-10">
          <h1 className="text-5xl md:text-7xl font-black text-center text-[#cf3328] mb-20 uppercase tracking-wide">
            Poke Bowl
          </h1>

          <div className="space-y-24 md:space-y-32">
            {pokeBowls.map((dish, index) => {
              const isEven = index % 2 === 0;
              const hasNutrition =
                dish.calories ||
                dish.protein ||
                dish.fats ||
                dish.carbs ||
                dish.vitaminC;
              const nutrition = hasNutrition
                ? {
                    calories: dish.calories || "-",
                    protein: dish.protein || "-",
                    fats: dish.fats || "-",
                    carbs: dish.carbs || "-",
                    vitaminC: dish.vitaminC || "-",
                  }
                : undefined;
              return (
                <div
                  key={dish.name}
                  className={`flex flex-col md:flex-row items-center gap-8 md:gap-16 ${
                    isEven ? "" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Image */}
                  <div className="w-full md:w-1/2 flex justify-center">
                    <div className="relative w-64 h-64 md:w-96 md:h-96 drop-shadow-[0_15px_15px_rgba(0,0,0,0.3)]">
                      <Image
                        src={dish.image || ""}
                        alt={dish.name}
                        fill
                        className="object-contain"
                        unoptimized
                      />
                    </div>
                  </div>

                  {/* Details */}
                  <div
                    className={`w-full md:w-1/2 flex flex-col ${
                      isEven
                        ? "md:items-start md:text-left"
                        : "md:items-end md:text-right"
                    } items-center text-center`}
                  >
                    <h2 className="text-4xl md:text-5xl font-black text-[#cf3328] mb-4">
                      {dish.name}
                    </h2>

                    <div className="space-y-4 max-w-xl">
                      {dish.description && (
                        <p className="text-base md:text-lg font-bold text-[#cf3328] leading-snug">
                          Key Benefits:{" "}
                          <span className="font-semibold">
                            {dish.description}
                          </span>
                        </p>
                      )}
                      {dish.ingredients && (
                        <p className="text-base md:text-lg font-bold text-[#cf3328] leading-snug">
                          Served with :{" "}
                          <span className="font-semibold">
                            {dish.ingredients}
                          </span>
                        </p>
                      )}
                    </div>

                    {nutrition && (
                      <div
                        className={`flex w-full ${isEven ? "justify-center md:justify-start" : "justify-center md:justify-end"}`}
                      >
                        <NutritionTable
                          nutrition={nutrition}
                          isRightAligned={isEven}
                        />
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
                const hasNutrition =
                  addon.calories ||
                  addon.protein ||
                  addon.fats ||
                  addon.carbs ||
                  addon.vitaminC;
                const nutrition = hasNutrition
                  ? {
                      calories: addon.calories || "-",
                      protein: addon.protein || "-",
                      fats: addon.fats || "-",
                      carbs: addon.carbs || "-",
                      vitaminC: addon.vitaminC || "-",
                    }
                  : undefined;

                return (
                  <div
                    key={addon.name}
                    className={`flex items-center gap-4 ${isRightColumn ? "flex-row-reverse" : ""}`}
                  >
                    <div className="relative w-24 h-24 md:w-32 md:h-32 shrink-0 drop-shadow-[0_10px_10px_rgba(0,0,0,0.25)]">
                      <Image
                        src={addon.image || ""}
                        alt={addon.name}
                        fill
                        className="object-contain"
                        unoptimized
                      />
                    </div>
                    <div
                      className={`flex-1 flex flex-col justify-center ${isRightColumn ? "items-end text-right" : "items-start text-left"}`}
                    >
                      <h3 className="text-xl md:text-2xl font-black text-[#cf3328] mb-1">
                        {addon.name}{" "}
                        {addon.tags && (
                          <span className="text-sm font-semibold text-[#cf3328]">
                            ({addon.tags})
                          </span>
                        )}
                      </h3>
                      {nutrition && (
                        <div className="w-full border-b-2 border-dotted border-[#cf3328] pb-1 mt-1">
                          <div
                            className={`grid grid-cols-[auto_auto] gap-x-3 gap-y-0 text-xs font-semibold text-[#cf3328] w-fit ${isRightColumn ? "ml-auto" : "mr-auto"}`}
                          >
                            <span className="text-left">Calories</span>
                            <span className="text-right">
                              {nutrition.calories}
                            </span>
                            <span className="text-left">Protein</span>
                            <span className="text-right">
                              {nutrition.protein}
                            </span>
                            <span className="text-left">Fats</span>
                            <span className="text-right">{nutrition.fats}</span>
                            <span className="text-left">Carbs</span>
                            <span className="text-right">
                              {nutrition.carbs}
                            </span>
                            <span className="text-left">Vitamin C</span>
                            <span className="text-right">
                              {nutrition.vitaminC}
                            </span>
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
                <div
                  key={sauce.name}
                  className="flex items-center -my-6 md:-my-10"
                >
                  <div className="relative w-48 h-48 md:w-64 md:h-64 shrink-0 drop-shadow-[0_10px_10px_rgba(0,0,0,0.25)]">
                    <Image
                      src={sauce.image || ""}
                      alt={sauce.name}
                      fill
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                  <div className="flex-1 min-w-0 -ml-8 md:-ml-16 z-10 relative">
                    <h3 className="flex items-baseline whitespace-nowrap text-xl md:text-2xl font-black text-[#cf3328] pb-2 border-b-2 border-dotted border-[#cf3328] w-fit pr-8">
                      {sauce.name}
                      {sauce.tags && (
                        <span className="ml-2 text-sm font-semibold text-[#cf3328]">
                          ({sauce.tags})
                        </span>
                      )}
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
