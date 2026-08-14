    "use client";

    import { useState } from "react";
    import Link from "next/link";
    import { Eye, EyeOff } from "lucide-react";

    export default function RegisterForm({
    action,
    }: {
    action: (formData: FormData) => void;
    }) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <form
        action={action}
        className="flex w-full max-w-sm flex-col gap-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6"
        >
        <h1 className="text-2xl font-bold text-black dark:text-white">Register</h1>

        <input
            type="text"
            name="name"
            placeholder="Full Name"
            className="rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-black dark:text-white placeholder:text-zinc-400"
            required
        />

        <input
            type="email"
            name="email"
            placeholder="Email"
            className="rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-black dark:text-white placeholder:text-zinc-400"
            required
        />

        <div className="relative">
            <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            className="w-full rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 pr-10 text-black dark:text-white placeholder:text-zinc-400"
            required
            minLength={6}
            />
            <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 dark:text-zinc-400"
            >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
        </div>

        <button
            type="submit"
            className="rounded bg-black dark:bg-white px-4 py-2 text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200"
        >
            Create Account
        </button>

        <p className="text-sm text-center text-zinc-600 dark:text-zinc-400">
            Already have an account?{" "}
            <Link href="/login" className="underline">
            Log in
            </Link>
        </p>
        </form>
    );
}