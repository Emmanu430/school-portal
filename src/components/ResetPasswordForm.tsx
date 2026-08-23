    "use client";

    import { useState } from "react";
    import { Eye, EyeOff } from "lucide-react";

    export default function ResetPasswordForm({
    action,
    }: {
    action: (formData: FormData) => void;
    }) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <form
        action={action}
        className="flex w-full max-w-sm flex-col gap-4 rounded-lg border border-border bg-card p-6"
        >
        <h1 className="text-2xl font-bold text-foreground">Set New Password</h1>

        <div className="relative flex items-center">
            <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="New Password"
            minLength={6}
            className="w-full rounded border border-border bg-input px-3 py-2 pr-10 text-foreground placeholder:text-muted-foreground"
            required
            />
            <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 text-muted-foreground"
            >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
        </div>

        <button
            type="submit"
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
            Reset Password
        </button>
        </form>
    );
}