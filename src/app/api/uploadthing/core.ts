    import { createUploadthing, type FileRouter } from "uploadthing/next";
    import { auth } from "@/auth";

    const f = createUploadthing();

    export const ourFileRouter = {
    studentPhoto: f({ image: { maxFileSize: "2MB" } })
        .middleware(async () => {
        const session = await auth();
        if (!session || session.user?.role !== "ADMIN") {
            throw new Error("Unauthorized");
        }
        return { userId: session.user.id };
        })
        .onUploadComplete(async ({ file }) => {
        return { url: file.ufsUrl };
        }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;