    "use client";
    import { useState, useEffect } from "react";
    import { Menu, X, School, Bell } from "lucide-react";
    import { ThemeToggle } from "@/components/theme-toggle";
    import { AccountMenu } from "@/components/AccountMenu";

    export default function MobileSidebar({
    children,
    userName,
    userEmail,
    userInitials,
    userImage,
    }: {
    children: React.ReactNode;
    userName?: string;
    userEmail?: string;
    userInitials?: string;
    userImage?: string | null;
    }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isDesktop, setIsDesktop] = useState(false);

    useEffect(() => {
        const mql = window.matchMedia("(min-width: 1024px)");
        setIsDesktop(mql.matches);
        const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
        mql.addEventListener("change", handler);
        return () => mql.removeEventListener("change", handler);
    }, []);

    return (
        <>
        {/* Topbar — always full width, shifts right on desktop to clear the sidebar */}
        <div
            className={`fixed top-0 z-30 h-14 flex items-center justify-between px-4 border-b border-border bg-card ${
            isDesktop ? "left-64 right-0" : "inset-x-0"
            }`}
        >
            {!isDesktop && (
            <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="text-foreground"
                aria-label="Open sidebar"
            >
                <Menu className="h-6 w-6" />
            </button>
            )}
            {isDesktop && <div />}

            <div className="flex items-center gap-4">
            <ThemeToggle />
            <button
                type="button"
                className="relative text-muted-foreground"
                aria-label="Notifications"
            >
                <Bell className=" h-4.5 w-4.5" />
                <span className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-accent" />
            </button>
            <AccountMenu name={userName} email={userEmail} initials={userInitials} imageUrl={userImage}/>
            </div>
        </div>

        {/* Backdrop — mobile only, desktop sidebar never overlays */}
        {!isDesktop && isOpen && (
            <div
            className="fixed inset-0 z-40 bg-black/40"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
            />
        )}

        {/* Sidebar — drawer on mobile, permanent panel on desktop */}
        <aside
            style={
            isDesktop
                ? undefined
                : { transform: isOpen ? "translateX(0)" : "translateX(-100%)" }
            }
            className={
            isDesktop
                ? "sticky top-0 z-0 h-screen w-64 shrink-0 border-r border-sidebar-border bg-sidebar p-4 flex flex-col gap-1"
                : "fixed inset-y-0 left-0 z-50 w-72 max-w-[85%] border-r border-sidebar-border bg-sidebar p-4 flex flex-col gap-1 transition-transform duration-200"
            }
        >
            <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
                <School className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="font-medium text-sidebar-foreground">
                School Portal
                </span>
            </div>
            {!isDesktop && (
                <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-sidebar-foreground/70 hover:text-sidebar-foreground"
                aria-label="Close sidebar"
                >
                <X className="h-5 w-5" />
                </button>
            )}
            </div>
            {children}
        </aside>
        </>
    );
}