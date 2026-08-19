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
        <main className="flex min-h-screen items-center justify-center bg-background">
        <form
            onSubmit={handleSubmit}
            className="flex w-full max-w-sm flex-col gap-4 rounded-lg border border-border bg-card p-6"
        >
            <h1 className="text-2xl font-bold text-foreground">Login</h1>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <input
            type="email"
            name="email"
            placeholder="Email"
            className="rounded border border-border bg-input px-3 py-2 text-foreground placeholder:text-muted-foreground [color-scheme:light] dark:[color-scheme:dark]"
            required
            />

            <div className="relative">
            <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                className="w-full rounded border border-border bg-input px-3 py-2 pr-10 text-foreground placeholder:text-muted-foreground [color-scheme:light] dark:[color-scheme:dark]"
                required
            />
            <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
            </div>

            <button
            type="submit"
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
            Log In
            </button>
            <p className="text-sm text-center text-muted-foreground">
                <Link href="/forgot-password" className="underline">
                    Forgot password?
                </Link>
            </p>
            <p className="text-sm text-center text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="underline">
                Register
            </Link>
            </p>
        </form>
        </main>
    );
}