    "use client";

    import { useState, useEffect, ReactNode } from "react";

    export function ResponsiveHeaderRow({
    left,
    right,
    }: {
    left: ReactNode;
    right: ReactNode;
    }) {
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
            alignItems: isDesktop ? "flex-end" : "flex-start",
            justifyContent: isDesktop ? "space-between" : "flex-start",
            gap: "1rem",
        }}
        >
        {left}
        <div style={{ width: "auto" }}>{right}</div>
        </div>
    );
}