    "use client";

    import { useState, useRef, useEffect } from "react";
    import Link from "next/link";
    import { LogOut, Settings, User } from "lucide-react";
    import { signOut } from "next-auth/react";

    export function AccountMenu({
    name,
    email,
    initials,
    imageUrl,
    }: {
    name?: string | null;
    email?: string | null;
    initials?: string;
    imageUrl?: string | null;
    }) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClick(e: MouseEvent) {
        if (ref.current && !ref.current.contains(e.target as Node)) {
            setOpen(false);
        }
        }
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    return (
        <div className="relative" ref={ref}>
        <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="h-7 w-7 rounded-full overflow-hidden flex items-center justify-center bg-accent text-accent-foreground text-xs font-semibold"
            aria-label="Account menu"
        >
            {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imageUrl} alt={name ?? "Profile"} className="h-full w-full object-cover" />
            ) : (
            initials ?? "?"
            )}
        </button>

        {open && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl border border-border bg-card shadow-lg z-50 overflow-hidden">
            <div className="px-4 py-3 border-b border-border">
                <p className="text-sm font-medium text-foreground truncate">{name ?? "Account"}</p>
                <p className="text-xs text-muted-foreground truncate">{email ?? ""}</p>
            </div>
            <Link href="/dashboard/profile" className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-foreground hover:bg-secondary text-left">
                <User className="h-4 w-4" />
                Profile
            </Link>
            <Link href="/dashboard/settings" className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-foreground hover:bg-secondary text-left">
                <Settings className="h-4 w-4" />
                Settings
            </Link>
            <button onClick={() => signOut({ callbackUrl: "/login" })} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-destructive hover:bg-secondary text-left border-t border-border">
                <LogOut className="h-4 w-4" />
                Log out
            </button>
            </div>
        )}
        </div>
    );
}