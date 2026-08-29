    "use client";

    import { useState } from "react";
    import { Eye, EyeOff } from "lucide-react";
    import { changePassword } from "@/app/actions/changePassword";

    export default function ChangePasswordForm() {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setSuccess(false);

        if (newPassword.length < 8) {
        setError("New password must be at least 8 characters.");
        return;
        }
        if (newPassword !== confirmPassword) {
        setError("New password and confirmation do not match.");
        return;
        }

        setLoading(true);
        const result = await changePassword({ currentPassword, newPassword });
        setLoading(false);

        if (!result.success) {
        setError(result.message);
        return;
        }

        setSuccess(true);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
            <label className="text-xs text-muted-foreground">Current password</label>
            <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground"
            />
        </div>

        <div>
            <label className="text-xs text-muted-foreground">New password</label>
            <div className="relative flex items-center mt-1">
            <input
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={8}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 pr-10 text-sm text-foreground"
            />
            <button
                type="button"
                onClick={() => setShowNew((s) => !s)}
                className="absolute right-3  text-muted-foreground"
                aria-label={showNew ? "Hide password" : "Show password"}
            >
                {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
            </div>
        </div>

        <div>
            <label className="text-xs text-muted-foreground">Confirm new password</label>
            <div className="relative flex items-center mt-1">
            <input
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 pr-10 text-sm text-foreground"
            />
            <button
                type="button"
                onClick={() => setShowConfirm((s) => !s)}
                className="absolute right-3  text-muted-foreground"
                aria-label={showConfirm ? "Hide password" : "Show password"}
            >
                {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
            </div>
        </div>

        {error && <p className="text-xs text-destructive">{error}</p>}
        {success && <p className="text-xs text-emerald-600">Password updated successfully.</p>}

        <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
            {loading ? "Updating..." : "Update password"}
        </button>
        </form>
    );
}