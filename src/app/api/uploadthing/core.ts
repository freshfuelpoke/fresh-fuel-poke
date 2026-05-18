import { cookies } from "next/headers";
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({ image: { maxFileSize: "2MB" } })
    // Set permissions and file types for this FileRoute
    .middleware(async () => {
      // This code runs on your server before upload
      const session = (await cookies()).get("admin_session");

      // If you throw, the user will not be able to upload
      if (session?.value !== "authenticated") throw new Error("Unauthorized");

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { adminId: "admin" };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata.adminId);
      console.log("file url", file.url);

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { uploadedBy: metadata.adminId };
    }),
  menuImageUploader: f({
    image: {
      maxFileSize: "1MB",
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      const session = (await cookies()).get("admin_session");

      if (session?.value !== "authenticated") throw new Error("Unauthorized");

      return { adminId: "admin" };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Menu image upload complete for userId:", metadata.adminId);
      console.log("file url", file.url);

      return { uploadedBy: metadata.adminId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
