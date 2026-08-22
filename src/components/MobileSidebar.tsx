    "use client";

    import { useState } from "react";
    import { Menu, X } from "lucide-react";

    export default function MobileSidebar({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
        {/* Mobile top bar with hamburger */}
        <div className="flex items-center justify-between border-b border-border p-4 lg:hidden">
            <span className="font-bold text-foreground">School Portal</span>
            <button onClick={() => setIsOpen(true)} className="text-foreground">
            <Menu className="h-6 w-6" />
            </button>
        </div>

        {/* Overlay backdrop when open on mobile */}
        {isOpen && (
            <div
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setIsOpen(false)}
            />
        )}

        {/* Sidebar itself */}
        <aside
            className={`fixed inset-y-0 left-0 z-50 w-56 shrink-0 border-r border-border bg-background p-4 flex flex-col gap-2 transition-transform lg:static lg:translate-x-0 ${
            isOpen ? "translate-x-0" : "-translate-x-full"
            }`}
        >
            <button
            onClick={() => setIsOpen(false)}
            className="self-end text-foreground lg:hidden"
            >
            <X className="h-5 w-5" />
            </button>
            {children}
        </aside>
        </>
    );
}