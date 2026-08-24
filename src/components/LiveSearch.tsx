    "use client";

    import { useState, useEffect } from "react";
    import { useRouter, usePathname, useSearchParams } from "next/navigation";
    import { Search } from "lucide-react";

    export default function LiveSearch({
    paramName = "search",
    placeholder = "Search...",
    }: {
    paramName?: string;
    placeholder?: string;
    }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [value, setValue] = useState(searchParams.get(paramName) ?? "");

    useEffect(() => {
        const timeout = setTimeout(() => {
        const params = new URLSearchParams(searchParams.toString());

        if (value) {
            params.set(paramName, value);
        } else {
            params.delete(paramName);
        }
        params.delete("page");

        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
        }, 300);

        return () => clearTimeout(timeout);
    }, [value]);

    return (
        <div className="relative flex items-center">
        <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
        <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder}
            className="w-full rounded-lg border border-input bg-background pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground"
        />
        </div>
    );
}