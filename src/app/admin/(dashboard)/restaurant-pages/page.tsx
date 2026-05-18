import { asc, sql } from "drizzle-orm";
import { Suspense } from "react";
import { db } from "@/db";
import { hours, restaurantInfo } from "@/db/schema";
import { PageSectionsManager } from "./page-sections-manager";

async function InfoPageContent() {
  let info:
    | {
        id: number;
        name: string;
        tagline: string;
        shortTagline: string;
        logo: string;
        story: string;
        storyImage1: string;
        storyImage1Title: string;
        storyImage1Description: string;
        storyImage2: string;
        storyImage2Title: string;
        storyImage2Description: string;
        storyImage3: string;
        storyImage3Title: string;
        storyImage3Description: string;
        location: string;
        addressLine: string;
        phone: string;
        whatsApp: string;
        contactEmail: string;
        serviceHeaderDescription: string;
        serviceDineInDescription: string;
        serviceTakeAwayDescription: string;
        serviceImage1: string;
        serviceImage2: string;
        serviceImage3: string;
        instagram: string;
        facebook: string;
        ctaPrimary: string;
        ctaSecondary: string;
      }
    | undefined;

  try {
    [info] = await db.select().from(restaurantInfo).limit(1);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const causeMessage =
      error instanceof Error &&
      error.cause &&
      typeof error.cause === "object" &&
      "message" in error.cause &&
      typeof error.cause.message === "string"
        ? error.cause.message
        : "";
    const combinedMessage = `${errorMessage} ${causeMessage}`;

    const missingCmsColumn =
      combinedMessage.includes("no such column: story_image_1") ||
      combinedMessage.includes("no such column: story_image_1_title") ||
      combinedMessage.includes("no such column: story_image_1_description") ||
      combinedMessage.includes("no such column: story_image_2") ||
      combinedMessage.includes("no such column: story_image_2_title") ||
      combinedMessage.includes("no such column: story_image_2_description") ||
      combinedMessage.includes("no such column: story_image_3") ||
      combinedMessage.includes("no such column: story_image_3_title") ||
      combinedMessage.includes("no such column: story_image_3_description") ||
      combinedMessage.includes("no such column: logo") ||
      combinedMessage.includes("no such column: phone") ||
      combinedMessage.includes("no such column: whats_app") ||
      combinedMessage.includes("no such column: contact_email") ||
      combinedMessage.includes("no such column: service_header_description") ||
      combinedMessage.includes("no such column: service_dine_in_description") ||
      combinedMessage.includes(
        "no such column: service_take_away_description",
      ) ||
      combinedMessage.includes("no such column: service_image_1") ||
      combinedMessage.includes("no such column: service_image_2") ||
      combinedMessage.includes("no such column: service_image_3") ||
      combinedMessage.includes("no such column: instagram") ||
      combinedMessage.includes("no such column: facebook");

    if (!missingCmsColumn) {
      throw error;
    }

    const legacyInfo = await db
      .select({
        id: sql<number>`id`,
        name: sql<string>`name`,
        tagline: sql<string>`tagline`,
        shortTagline: sql<string>`short_tagline`,
        story: sql<string>`story`,
        location: sql<string>`location`,
        addressLine: sql<string>`address_line`,
        ctaPrimary: sql<string>`cta_primary`,
        ctaSecondary: sql<string>`cta_secondary`,
      })
      .from(sql`restaurant_info`)
      .limit(1);

    info = legacyInfo[0]
      ? {
          ...legacyInfo[0],
          logo: "",
          storyImage1: "",
          storyImage1Title: "",
          storyImage1Description: "",
          storyImage2: "",
          storyImage2Title: "",
          storyImage2Description: "",
          storyImage3: "",
          storyImage3Title: "",
          storyImage3Description: "",
          phone: "",
          whatsApp: "",
          contactEmail: "",
          serviceHeaderDescription: "",
          serviceDineInDescription: "",
          serviceTakeAwayDescription: "",
          serviceImage1: "",
          serviceImage2: "",
          serviceImage3: "",
          instagram: "",
          facebook: "",
        }
      : undefined;
  }

  const allHours = await db
    .select()
    .from(hours)
    .orderBy(asc(hours.displayOrder));

  return <PageSectionsManager info={info} hours={allHours} />;
}

function InfoPageFallback() {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-6 text-sm text-stone-500 shadow-sm">
      Loading page settings...
    </div>
  );
}

export default function InfoPage() {
  return (
    <div className="space-y-8">
      <div>
        <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">
          Admin
        </p>
        <h1 className="text-3xl font-serif text-stone-900">Pages</h1>
        <p className="mt-1 text-sm text-stone-500">
          Edit your story section, story images, hours, and location details.
        </p>
      </div>

      <Suspense fallback={<InfoPageFallback />}>
        <InfoPageContent />
      </Suspense>
    </div>
  );
}
