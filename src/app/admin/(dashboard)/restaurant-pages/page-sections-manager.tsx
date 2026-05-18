"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { updateRestaurantInfo } from "@/app/actions/admin";
import { storyCardDefaults } from "@/components/restaurant/story-card-defaults";
import { UploadButton } from "@/utils/uploadthing";
import { HoursManager } from "./hours-manager";

type Info =
  | {
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
    }
  | undefined;

type Hour = {
  id: number;
  label: string;
  value: string;
  displayOrder: number;
};

type StoryImageKey = "storyImage1" | "storyImage2" | "storyImage3";
type StoryImageTitleKey =
  | "storyImage1Title"
  | "storyImage2Title"
  | "storyImage3Title";
type StoryImageDescriptionKey =
  | "storyImage1Description"
  | "storyImage2Description"
  | "storyImage3Description";

const storyImageFields: Array<{
  key: StoryImageKey;
  titleKey: StoryImageTitleKey;
  descriptionKey: StoryImageDescriptionKey;
  label: string;
}> = [
  {
    key: "storyImage1",
    titleKey: "storyImage1Title",
    descriptionKey: "storyImage1Description",
    label: "Story Card 1",
  },
  {
    key: "storyImage2",
    titleKey: "storyImage2Title",
    descriptionKey: "storyImage2Description",
    label: "Story Card 2",
  },
  {
    key: "storyImage3",
    titleKey: "storyImage3Title",
    descriptionKey: "storyImage3Description",
    label: "Story Card 3",
  },
];

function StoryImageEditor({
  label,
  value,
  title,
  description,
  onChange,
  onTitleChange,
  onDescriptionChange,
  disabled,
}: {
  label: string;
  value: string;
  title: string;
  description: string;
  onChange: (nextValue: string) => void;
  onTitleChange: (nextValue: string) => void;
  onDescriptionChange: (nextValue: string) => void;
  disabled?: boolean;
}) {
  const headingId = `${label.toLowerCase().replace(/\s+/g, "-")}-heading`;
  const descriptionId = `${label.toLowerCase().replace(/\s+/g, "-")}-description`;

  return (
    <div className="space-y-4 rounded-2xl border border-stone-200 bg-stone-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-stone-400">
        {label}
      </p>
      <div className="relative overflow-hidden rounded-2xl border border-stone-200 bg-stone-100">
        <div className="relative aspect-[4/3] w-full">
          {value ? (
            <Image
              src={value}
              alt={label}
              fill
              sizes="(max-width: 768px) 100vw, 320px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-[radial-gradient(circle_at_top_left,_rgba(217,119,6,0.16),_transparent_42%),radial-gradient(circle_at_bottom_right,_rgba(120,113,108,0.18),_transparent_40%),linear-gradient(135deg,_#fafaf9,_#f5f5f4)]" />
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <UploadButton
          endpoint="imageUploader"
          disabled={disabled}
          onClientUploadComplete={(res) => {
            if (res?.[0]?.url) {
              onChange(res[0].url);
            }
          }}
          appearance={{
            button:
              "rounded-full bg-stone-900 px-5 py-2 text-xs font-semibold text-white transition-colors hover:bg-stone-700 ut-readying:bg-stone-500 ut-uploading:bg-stone-500 w-full",
            allowedContent: "hidden",
            container: "w-full",
          }}
          content={{
            button: "Change image",
            allowedContent: null,
          }}
        />
      </div>
      <div>
        <label
          htmlFor={headingId}
          className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-stone-400"
        >
          Heading
        </label>
        <input
          id={headingId}
          type="text"
          value={title}
          onChange={(event) => onTitleChange(event.target.value)}
          disabled={disabled}
          className="w-full rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm text-stone-800 transition-all focus:border-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-900/20 disabled:opacity-50"
        />
      </div>
      <div>
        <label
          htmlFor={descriptionId}
          className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-stone-400"
        >
          Description
        </label>
        <textarea
          id={descriptionId}
          value={description}
          onChange={(event) => onDescriptionChange(event.target.value)}
          rows={4}
          disabled={disabled}
          className="w-full resize-y rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-800 transition-all focus:border-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-900/20 disabled:opacity-50"
        />
      </div>
    </div>
  );
}

function ServiceImageEditor({
  label,
  value,
  onChange,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-stone-100 bg-stone-50 p-4">
      <div>
        <span className="mb-3 block text-xs font-semibold uppercase tracking-[0.12em] text-stone-400">
          {label}
        </span>
        <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-stone-200">
          {value ? (
            <Image
              src={value}
              alt={label}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-[radial-gradient(circle_at_top_left,_rgba(217,119,6,0.16),_transparent_42%),radial-gradient(circle_at_bottom_right,_rgba(120,113,108,0.18),_transparent_40%),linear-gradient(135deg,_#fafaf9,_#f5f5f4)]" />
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <UploadButton
          endpoint="imageUploader"
          disabled={disabled}
          onClientUploadComplete={(res) => {
            if (res?.[0]?.url) {
              onChange(res[0].url);
            }
          }}
          appearance={{
            button:
              "rounded-full bg-stone-900 px-5 py-2 text-xs font-semibold text-white transition-colors hover:bg-stone-700 ut-readying:bg-stone-500 ut-uploading:bg-stone-500 w-full",
            allowedContent: "hidden",
            container: "w-full",
          }}
          content={{
            button: "Change image",
            allowedContent: null,
          }}
        />
      </div>
    </div>
  );
}

const servicesFormIds = {
  headerDescription: "service-header-description",
  dineInDescription: "service-dine-in-description",
  takeAwayDescription: "service-take-away-description",
} as const;

export function PageSectionsManager({
  info,
  hours,
}: {
  info: Info;
  hours: Hour[];
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    "story" | "hours" | "services" | "social"
  >("story");
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Controlled state for contact/location fields so both forms always submit the latest values
  const [name] = useState(info?.name ?? "");
  const [tagline] = useState(info?.tagline ?? "");
  const [shortTagline] = useState(info?.shortTagline ?? "");
  const [story, setStory] = useState(info?.story ?? "");
  const [location, setLocation] = useState(info?.location ?? "");
  const [addressLine, setAddressLine] = useState(info?.addressLine ?? "");
  const [phone, setPhone] = useState(info?.phone ?? "");
  const [whatsApp, setWhatsApp] = useState(info?.whatsApp ?? "");
  const [logo, setLogo] = useState(info?.logo ?? "");
  const [contactEmail, setContactEmail] = useState(info?.contactEmail ?? "");

  const [serviceHeaderDescription, setServiceHeaderDescription] = useState(
    info?.serviceHeaderDescription ?? "",
  );
  const [serviceDineInDescription, setServiceDineInDescription] = useState(
    info?.serviceDineInDescription ?? "",
  );
  const [serviceTakeAwayDescription, setServiceTakeAwayDescription] = useState(
    info?.serviceTakeAwayDescription ?? "",
  );
  const [serviceImage2, setServiceImage2] = useState(info?.serviceImage2 ?? "");
  const [serviceImage3, setServiceImage3] = useState(info?.serviceImage3 ?? "");
  const [instagram, setInstagram] = useState(info?.instagram ?? "");
  const [facebook, setFacebook] = useState(info?.facebook ?? "");

  const [storyImages, setStoryImages] = useState<Record<StoryImageKey, string>>(
    {
      storyImage1: info?.storyImage1 || storyCardDefaults.storyImage1.image,
      storyImage2: info?.storyImage2 || storyCardDefaults.storyImage2.image,
      storyImage3: info?.storyImage3 || storyCardDefaults.storyImage3.image,
    },
  );
  const [storyImageTitles, setStoryImageTitles] = useState<
    Record<StoryImageTitleKey, string>
  >({
    storyImage1Title:
      info?.storyImage1Title || storyCardDefaults.storyImage1.title,
    storyImage2Title:
      info?.storyImage2Title || storyCardDefaults.storyImage2.title,
    storyImage3Title:
      info?.storyImage3Title || storyCardDefaults.storyImage3.title,
  });
  const [storyImageDescriptions, setStoryImageDescriptions] = useState<
    Record<StoryImageDescriptionKey, string>
  >({
    storyImage1Description:
      info?.storyImage1Description || storyCardDefaults.storyImage1.description,
    storyImage2Description:
      info?.storyImage2Description || storyCardDefaults.storyImage2.description,
    storyImage3Description:
      info?.storyImage3Description || storyCardDefaults.storyImage3.description,
  });

  function updateStoryImage(key: StoryImageKey, value: string) {
    setStoryImages((prev) => ({ ...prev, [key]: value }));
  }

  function updateStoryImageTitle(key: StoryImageTitleKey, value: string) {
    setStoryImageTitles((prev) => ({ ...prev, [key]: value }));
  }

  function updateStoryImageDescription(
    key: StoryImageDescriptionKey,
    value: string,
  ) {
    setStoryImageDescriptions((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(formData: FormData) {
    setStatus(null);
    // Always inject the latest controlled field values so both tabs submit correct data
    formData.set("name", name);
    formData.set("tagline", tagline);
    formData.set("shortTagline", shortTagline);
    formData.set("story", story);
    formData.set("location", location);
    formData.set("addressLine", addressLine);
    formData.set("phone", phone);
    formData.set("whatsApp", whatsApp);
    formData.set("logo", logo);
    formData.set("contactEmail", contactEmail);
    formData.set("storyImage1", storyImages.storyImage1);
    formData.set("storyImage1Title", storyImageTitles.storyImage1Title);
    formData.set(
      "storyImage1Description",
      storyImageDescriptions.storyImage1Description,
    );
    formData.set("storyImage2", storyImages.storyImage2);
    formData.set("storyImage2Title", storyImageTitles.storyImage2Title);
    formData.set(
      "storyImage2Description",
      storyImageDescriptions.storyImage2Description,
    );
    formData.set("storyImage3", storyImages.storyImage3);
    formData.set("storyImage3Title", storyImageTitles.storyImage3Title);
    formData.set(
      "storyImage3Description",
      storyImageDescriptions.storyImage3Description,
    );
    formData.set("serviceHeaderDescription", serviceHeaderDescription);
    formData.set("serviceDineInDescription", serviceDineInDescription);
    formData.set("serviceTakeAwayDescription", serviceTakeAwayDescription);
    formData.set("serviceImage2", serviceImage2);
    formData.set("serviceImage3", serviceImage3);
    formData.set("instagram", instagram);
    formData.set("facebook", facebook);

    startTransition(async () => {
      const res = await updateRestaurantInfo(formData);

      if (res?.error) {
        setStatus({ type: "error", message: res.error });
      } else {
        setStatus({
          type: "success",
          message: "Page content saved successfully.",
        });
        // Auto-dismiss success toast and refresh server data
        setTimeout(() => setStatus(null), 2000);
        router.refresh();
      }
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 rounded-2xl border border-stone-200 bg-white p-2 shadow-sm">
        <button
          type="button"
          onClick={() => setActiveTab("story")}
          disabled={isPending}
          className={`rounded-xl px-4 py-2 text-sm font-semibold transition-colors disabled:opacity-50 ${
            activeTab === "story"
              ? "bg-stone-900 text-white"
              : "text-stone-500 hover:bg-stone-100 hover:text-stone-900"
          }`}
        >
          Our Story
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("hours")}
          disabled={isPending}
          className={`rounded-xl px-4 py-2 text-sm font-semibold transition-colors disabled:opacity-50 ${
            activeTab === "hours"
              ? "bg-stone-900 text-white"
              : "text-stone-500 hover:bg-stone-100 hover:text-stone-900"
          }`}
        >
          Hours & Location
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("services")}
          disabled={isPending}
          className={`rounded-xl px-4 py-2 text-sm font-semibold transition-colors disabled:opacity-50 ${
            activeTab === "services"
              ? "bg-stone-900 text-white"
              : "text-stone-500 hover:bg-stone-100 hover:text-stone-900"
          }`}
        >
          Dine-in & Delivery
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("social")}
          disabled={isPending}
          className={`rounded-xl px-4 py-2 text-sm font-semibold transition-colors disabled:opacity-50 ${
            activeTab === "social"
              ? "bg-stone-900 text-white"
              : "text-stone-500 hover:bg-stone-100 hover:text-stone-900"
          }`}
        >
          Social Links
        </button>
      </div>

      {activeTab === "story" ? (
        <div className="rounded-2xl border border-stone-200 bg-white shadow-sm">
          <div className="border-b border-stone-100 px-6 py-5">
            <h2 className="font-semibold text-stone-800">Our Story</h2>
            <p className="mt-0.5 text-xs text-stone-400">
              Edit the story copy and the three story images shown on the
              homepage.
            </p>
          </div>
          <div className="p-6">
            <form action={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <input type="hidden" name="name" value={info?.name ?? ""} />
                <input
                  type="hidden"
                  name="tagline"
                  value={info?.tagline ?? ""}
                />
                <input
                  type="hidden"
                  name="shortTagline"
                  value={info?.shortTagline ?? ""}
                />
                <input type="hidden" name="location" value={location} />
                <input type="hidden" name="addressLine" value={addressLine} />
                <input type="hidden" name="phone" value={phone} />
                <input type="hidden" name="whatsApp" value={whatsApp} />
                <input type="hidden" name="logo" value={logo} />
                <input type="hidden" name="contactEmail" value={contactEmail} />

                <div>
                  <label
                    htmlFor="restaurant-info-story"
                    className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-stone-400"
                  >
                    Our Story
                  </label>
                  <textarea
                    id="restaurant-info-story"
                    name="story"
                    value={story}
                    onChange={(e) => setStory(e.target.value)}
                    rows={10}
                    disabled={isPending}
                    className="w-full resize-y rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-800 transition-all focus:border-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-900/20 disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="grid gap-5 lg:grid-cols-3">
                {storyImageFields.map((field) => (
                  <StoryImageEditor
                    key={field.key}
                    label={field.label}
                    value={storyImages[field.key]}
                    title={storyImageTitles[field.titleKey]}
                    description={storyImageDescriptions[field.descriptionKey]}
                    onChange={(value) => updateStoryImage(field.key, value)}
                    onTitleChange={(value) =>
                      updateStoryImageTitle(field.titleKey, value)
                    }
                    onDescriptionChange={(value) =>
                      updateStoryImageDescription(field.descriptionKey, value)
                    }
                    disabled={isPending}
                  />
                ))}
              </div>

              {status && (
                <p
                  className={`rounded-xl px-4 py-2.5 text-sm ${
                    status.type === "success"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-red-50 text-red-600"
                  }`}
                >
                  {status.message}
                </p>
              )}

              <button
                type="submit"
                disabled={isPending}
                className="rounded-xl bg-stone-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-stone-700 disabled:opacity-40"
              >
                {isPending ? "Updating…" : "Update Story"}
              </button>
            </form>
          </div>
        </div>
      ) : activeTab === "hours" ? (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <div className="rounded-2xl border border-stone-200 bg-white shadow-sm">
            <div className="border-b border-stone-100 px-6 py-5">
              <h2 className="font-semibold text-stone-800">Hours & Location</h2>
              <p className="mt-0.5 text-xs text-stone-400">
                Update the homepage location details for the visit section.
              </p>
            </div>
            <div className="p-6">
              <form action={handleSubmit} className="space-y-4">
                <input type="hidden" name="name" value={info?.name ?? ""} />
                <input
                  type="hidden"
                  name="tagline"
                  value={info?.tagline ?? ""}
                />
                <input
                  type="hidden"
                  name="shortTagline"
                  value={info?.shortTagline ?? ""}
                />
                <input type="hidden" name="story" value={info?.story ?? ""} />
                <input type="hidden" name="logo" value={logo} />
                <input type="hidden" name="contactEmail" value={contactEmail} />
                <input
                  type="hidden"
                  name="storyImage1"
                  value={storyImages.storyImage1}
                />
                <input
                  type="hidden"
                  name="storyImage1Title"
                  value={storyImageTitles.storyImage1Title}
                />
                <input
                  type="hidden"
                  name="storyImage1Description"
                  value={storyImageDescriptions.storyImage1Description}
                />
                <input
                  type="hidden"
                  name="storyImage2"
                  value={storyImages.storyImage2}
                />
                <input
                  type="hidden"
                  name="storyImage2Title"
                  value={storyImageTitles.storyImage2Title}
                />
                <input
                  type="hidden"
                  name="storyImage2Description"
                  value={storyImageDescriptions.storyImage2Description}
                />
                <input
                  type="hidden"
                  name="storyImage3"
                  value={storyImages.storyImage3}
                />
                <input
                  type="hidden"
                  name="storyImage3Title"
                  value={storyImageTitles.storyImage3Title}
                />
                <input
                  type="hidden"
                  name="storyImage3Description"
                  value={storyImageDescriptions.storyImage3Description}
                />
                <div>
                  <label
                    htmlFor="restaurant-info-location"
                    className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-stone-400"
                  >
                    Header (Hours &amp; Location Description)
                  </label>
                  <textarea
                    id="restaurant-info-location"
                    name="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    rows={3}
                    disabled={isPending}
                    className="w-full resize-y rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-800 transition-all focus:border-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-900/20 disabled:opacity-50"
                  />
                  <p className="mt-1.5 mb-6 text-xs text-stone-400">
                    Displayed as the introductory paragraph above the hours
                    list.
                  </p>
                </div>
                <div>
                  <label
                    htmlFor="restaurant-info-address-line"
                    className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-stone-400"
                  >
                    Address Line
                  </label>
                  <input
                    id="restaurant-info-address-line"
                    type="text"
                    name="addressLine"
                    value={addressLine}
                    onChange={(e) => setAddressLine(e.target.value)}
                    disabled={isPending}
                    className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-sm text-stone-800 transition-all focus:border-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-900/20 disabled:opacity-50"
                  />
                </div>
                <div className="rounded-xl border border-stone-100 bg-stone-50 p-4">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-stone-400">
                    Contact
                  </p>
                  <div className="space-y-3">
                    <div>
                      <label
                        htmlFor="restaurant-info-phone"
                        className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-stone-400"
                      >
                        Tel (full number incl. country code)
                      </label>
                      <input
                        id="restaurant-info-phone"
                        type="text"
                        name="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. +85223456786"
                        disabled={isPending}
                        className="w-full rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm text-stone-800 transition-all focus:border-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-900/20 disabled:opacity-50"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="restaurant-info-whatsapp"
                        className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-stone-400"
                      >
                        WhatsApp (full number incl. country code)
                      </label>
                      <input
                        id="restaurant-info-whatsapp"
                        type="text"
                        name="whatsApp"
                        value={whatsApp}
                        onChange={(e) => setWhatsApp(e.target.value)}
                        placeholder="e.g. +85256746533"
                        disabled={isPending}
                        className="w-full rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm text-stone-800 transition-all focus:border-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-900/20 disabled:opacity-50"
                      />
                    </div>
                  </div>
                </div>

                {status && (
                  <p
                    className={`rounded-xl px-4 py-2.5 text-sm ${
                      status.type === "success"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-red-50 text-red-600"
                    }`}
                  >
                    {status.message}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full rounded-xl bg-stone-900 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-stone-700 disabled:opacity-40"
                >
                  {isPending ? "Saving…" : "Save Location"}
                </button>
              </form>
            </div>
          </div>

          <div className="rounded-2xl border border-stone-200 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-stone-100 px-6 py-5">
              <h2 className="font-semibold text-stone-800">Opening Hours</h2>
              <p className="mt-0.5 text-xs text-stone-400">
                Displayed in the homepage hours section.
              </p>
            </div>
            <div className="p-6">
              <HoursManager hours={hours} />
            </div>
          </div>
        </div>
      ) : activeTab === "services" ? (
        <div className="rounded-2xl border border-stone-200 bg-white shadow-sm">
          <div className="border-b border-stone-100 px-6 py-5">
            <h2 className="font-semibold text-stone-800">
              Dine-in &amp; Delivery Services
            </h2>
            <p className="mt-0.5 text-xs text-stone-400">
              Manage the content and images for the Dine-in &amp; Delivery page.
            </p>
          </div>
          <div className="p-6">
            <form action={handleSubmit} className="space-y-6">
              <input type="hidden" name="logo" value={logo} />
              <input type="hidden" name="contactEmail" value={contactEmail} />
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor={servicesFormIds.headerDescription}
                    className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-stone-400"
                  >
                    Header Description
                  </label>
                  <textarea
                    id={servicesFormIds.headerDescription}
                    rows={4}
                    value={serviceHeaderDescription}
                    onChange={(e) =>
                      setServiceHeaderDescription(e.target.value)
                    }
                    disabled={isPending}
                    className="w-full resize-y rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-800 transition-all focus:border-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-900/20 disabled:opacity-50"
                  />
                </div>
                <div>
                  <label
                    htmlFor={servicesFormIds.dineInDescription}
                    className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-stone-400"
                  >
                    Dine-In Description
                  </label>
                  <textarea
                    id={servicesFormIds.dineInDescription}
                    rows={4}
                    value={serviceDineInDescription}
                    onChange={(e) =>
                      setServiceDineInDescription(e.target.value)
                    }
                    disabled={isPending}
                    className="w-full resize-y rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-800 transition-all focus:border-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-900/20 disabled:opacity-50"
                  />
                </div>
                <div>
                  <label
                    htmlFor={servicesFormIds.takeAwayDescription}
                    className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-stone-400"
                  >
                    Take Away Description
                  </label>
                  <textarea
                    id={servicesFormIds.takeAwayDescription}
                    rows={4}
                    value={serviceTakeAwayDescription}
                    onChange={(e) =>
                      setServiceTakeAwayDescription(e.target.value)
                    }
                    disabled={isPending}
                    className="w-full resize-y rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-800 transition-all focus:border-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-900/20 disabled:opacity-50"
                  />
                </div>
              </div>
              <div className="grid gap-5 lg:grid-cols-2">
                <ServiceImageEditor
                  label="Large Preview Image"
                  value={serviceImage2}
                  onChange={setServiceImage2}
                  disabled={isPending}
                />
                <ServiceImageEditor
                  label="Small Overlapping Image"
                  value={serviceImage3}
                  onChange={setServiceImage3}
                  disabled={isPending}
                />
              </div>
              {status && (
                <p
                  className={`rounded-xl px-4 py-2.5 text-sm ${status.type === "success" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`}
                >
                  {status.message}
                </p>
              )}
              <button
                type="submit"
                disabled={isPending}
                className="rounded-xl bg-stone-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-stone-700 disabled:opacity-40"
              >
                {isPending ? "Updating…" : "Update Services"}
              </button>
            </form>
          </div>
        </div>
      ) : activeTab === "social" ? (
        <div className="rounded-2xl border border-stone-200 bg-white shadow-sm">
          <div className="border-b border-stone-100 px-6 py-5">
            <h2 className="font-semibold text-stone-800">Social Links</h2>
            <p className="mt-0.5 text-xs text-stone-400">
              Manage your restaurant&apos;s social media presence.
            </p>
          </div>
          <div className="p-6">
            <form action={handleSubmit} className="space-y-6">
              <div className="rounded-xl border border-stone-100 bg-stone-50 p-4">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-stone-400">
                  Brand & Contact
                </p>
                <div className="space-y-4">
                  <div>
                    <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-stone-400">
                      Shared Logo
                    </span>
                    <div className="space-y-3">
                      <div className="relative overflow-hidden rounded-2xl border border-stone-200 bg-stone-100 p-4">
                        <div className="relative flex h-24 items-center justify-center rounded-xl bg-white">
                          {logo ? (
                            <Image
                              src={logo}
                              alt="Restaurant logo"
                              fill={false}
                              width={180}
                              height={90}
                              className="h-auto max-h-16 w-auto max-w-[180px] object-contain"
                            />
                          ) : (
                            <span className="text-sm text-stone-400">
                              No logo uploaded yet
                            </span>
                          )}
                        </div>
                      </div>
                      <UploadButton
                        endpoint="imageUploader"
                        disabled={isPending}
                        onClientUploadComplete={(res) => {
                          if (res?.[0]?.url) {
                            setLogo(res[0].url);
                          }
                        }}
                        appearance={{
                          button:
                            "rounded-full bg-stone-900 px-5 py-2 text-xs font-semibold text-white transition-colors hover:bg-stone-700 ut-readying:bg-stone-500 ut-uploading:bg-stone-500",
                          allowedContent: "hidden",
                        }}
                        content={{
                          button: logo ? "Change logo" : "Upload logo",
                          allowedContent: null,
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="contact-email"
                      className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-stone-400"
                    >
                      Contact Email
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      name="contactEmail"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="hello@freshfuelpoke.com"
                      disabled={isPending}
                      className="w-full rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm text-stone-800 transition-all focus:border-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-900/20 disabled:opacity-50"
                    />
                    <p className="mt-1.5 text-xs text-stone-400">
                      Stored now for future email sending flows.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-stone-100 bg-stone-50 p-4">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-stone-400">
                  Connect Your Pages
                </p>
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="social-instagram"
                      className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-stone-400"
                    >
                      Instagram URL
                    </label>
                    <input
                      id="social-instagram"
                      type="text"
                      name="instagram"
                      value={instagram}
                      onChange={(e) => setInstagram(e.target.value)}
                      placeholder="https://instagram.com/freshfuel"
                      disabled={isPending}
                      className="w-full rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm text-stone-800 transition-all focus:border-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-900/20 disabled:opacity-50"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="social-facebook"
                      className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-stone-400"
                    >
                      Facebook URL
                    </label>
                    <input
                      id="social-facebook"
                      type="text"
                      name="facebook"
                      value={facebook}
                      onChange={(e) => setFacebook(e.target.value)}
                      placeholder="https://facebook.com/freshfuel"
                      disabled={isPending}
                      className="w-full rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm text-stone-800 transition-all focus:border-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-900/20 disabled:opacity-50"
                    />
                  </div>
                </div>
              </div>

              {status && (
                <p
                  className={`rounded-xl px-4 py-2.5 text-sm ${
                    status.type === "success"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-red-50 text-red-600"
                  }`}
                >
                  {status.message}
                </p>
              )}

              <button
                type="submit"
                disabled={isPending}
                className="rounded-xl bg-stone-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-stone-700 disabled:opacity-40"
              >
                {isPending ? "Updating…" : "Update Social Links"}
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
