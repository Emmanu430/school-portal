"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");

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
        <main className="flex min-h-screen items-center justify-center">
        <form
            onSubmit={handleSubmit}
            className="flex w-full max-w-sm flex-col gap-4 rounded-lg border p-6"
        >
            <h1 className="text-2xl font-bold">Login</h1>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded border px-3 py-2"
            required
            />

            <div className="relative">
            <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded border px-3 py-2 pr-10"
                required
            />
            <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-zinc-500"
            >
                {showPassword ? "Hide" : "Show"}
            </button>
            </div>

            <button
            type="submit"
            className="rounded bg-black px-4 py-2 text-white hover:bg-zinc-800"
            >
            Log In
            </button>
        </form>
        </main>
    );
}