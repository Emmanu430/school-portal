    "use client";

    import { UploadButton } from "@/lib/uploadthing";
    import { useState } from "react";

    export default function UserPhotoUpload({
    currentPhotoUrl,
    onSaved,
    }: {
    currentPhotoUrl?: string | null;
    onSaved: (url: string) => void;
    }) {
    const [photoUrl, setPhotoUrl] = useState(currentPhotoUrl ?? "");
    const [saving, setSaving] = useState(false);

    return (
        <div className="flex flex-col items-center gap-3">
        {photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
            src={photoUrl}
            alt="Profile photo"
            className="h-24 w-24 rounded-full object-cover border border-border"
            />
        ) : (
            <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-semibold">
            ?
            </div>
        )}

        <UploadButton
            endpoint="userPhoto"
            onClientUploadComplete={async (res) => {
            if (res?.[0]?.url) {
                setPhotoUrl(res[0].url);
                setSaving(true);
                await onSaved(res[0].url);
                setSaving(false);
            }
            }}
            onUploadError={(error: Error) => {
            alert(`Upload failed: ${error.message}`);
            }}
        />

        {saving && <p className="text-xs text-muted-foreground">Saving...</p>}
        </div>
    );
}