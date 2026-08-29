    "use client";

    import { useState, useEffect } from "react";
    import Link from "next/link";

    export function LandingButtons() {
    const [isDesktop, setIsDesktop] = useState(false);

    useEffect(() => {
        const mql = window.matchMedia("(min-width: 640px)");
        setIsDesktop(mql.matches);
        const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
        mql.addEventListener("change", handler);
        return () => mql.removeEventListener("change", handler);
    }, []);

    return (
        <div
        style={{
            display: "flex",
            flexDirection: isDesktop ? "row" : "column",
            width: isDesktop ? "auto" : "100%",
            maxWidth: isDesktop ? "none" : "20rem",
            gap: "0.75rem",
        }}
        >
        <Link
            href="/login"
            className="rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 text-center"
        >
            Log in
        </Link>
        <Link
            href="/register"
            className="rounded-lg border border-border px-6 py-3 text-sm font-medium text-foreground hover:bg-secondary text-center"
        >
            Register
        </Link>
        </div>
    );
}