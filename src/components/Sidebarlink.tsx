    "use client";

    import Link from "next/link";
    import { usePathname } from "next/navigation";
    import { ReactNode } from "react";
    import { cn } from "@/lib/utils";

    interface SidebarLinkProps {
    href: string;
    icon: ReactNode;
    label: string;
    }

    export function SidebarLink({ href, icon, label }: SidebarLinkProps) {
    const pathname = usePathname();
    const isActive = pathname === href;

    return (
        <Link
        href={href}
        className={cn(
            "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors",
            isActive
            ? "bg-primary text-primary-foreground font-medium"
            : "text-muted-foreground hover:bg-secondary hover:text-foreground"
        )}
        >
        {icon}
        {label}
        </Link>
    );
}