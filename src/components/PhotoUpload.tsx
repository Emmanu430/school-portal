    "use client";

    import { UploadButton } from "@/lib/uploadthing";
    import { useState } from "react";

    export default function PhotoUpload({
    currentPhotoUrl,
    }: {
    currentPhotoUrl?: string | null;
    }) {
    const [photoUrl, setPhotoUrl] = useState(currentPhotoUrl ?? "");

    return (
        <div className="flex flex-col items-center gap-2">
        {photoUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
            src={photoUrl}
            alt="Student photo"
            className="h-24 w-24 rounded-full object-cover border border-border"
            />
        )}

        <input type="hidden" name="photoUrl" value={photoUrl} />

        <UploadButton
            endpoint="studentPhoto"
            onClientUploadComplete={(res) => {
            if (res?.[0]?.url) {
                setPhotoUrl(res[0].url);
            }
            }}
            onUploadError={(error: Error) => {
            alert(`Upload failed: ${error.message}`);
            }}
        />
        </div>
    );
}