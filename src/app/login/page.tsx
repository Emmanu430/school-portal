"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError("");

        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        });

        if (result?.error) {
        setError("Invalid email or password");
        } else {
        router.push("/dashboard");
        }
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-white dark:bg-black">
        <form
            onSubmit={handleSubmit}
            className="flex w-full max-w-sm flex-col gap-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6"
        >
            <h1 className="text-2xl font-bold text-black dark:text-white">Login</h1>

            {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

            <input
            type="email"
            name="email"
            placeholder="Email"
            className="rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-black dark:text-white placeholder:text-zinc-400 [color-scheme:light] dark:[color-scheme:dark]"
            required
            />

            <div className="relative">
            <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                className="w-full rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 pr-10 text-black dark:text-white placeholder:text-zinc-400 [color-scheme:light] dark:[color-scheme:dark]"
                required
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
            Log In
            </button>
            <p className="text-sm text-center text-zinc-600 dark:text-zinc-400">
                Don&apos;t have an account?{" "}
                <Link href="/register" className="underline">
                    Register
                </Link>
            </p>
        </form>
        </main>
    );
}