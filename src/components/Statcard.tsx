    import { LucideIcon, MoreHorizontal } from "lucide-react";
    import Link from "next/link";
    import { cn } from "@/lib/utils";

    interface StatCardProps {
    icon: LucideIcon;
    label: string;
    value: string | number;
    change?: {
        value: string;
        direction: "up" | "down";
    };
    helperText?: string;
    className?: string;
    menuHref?: string;
    }

    export function StatCard({
    icon: Icon,
    label,
    value,
    change,
    helperText,
    className,
    menuHref,
    }: StatCardProps) {
    return (
        <div
        className={cn(
            "rounded-2xl border border-border bg-card p-4 sm:p-5",
            className
        )}
        >
        <div className="flex items-start justify-between">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
            <Icon className="h-4.5 w-4.5 text-primary" />
            </div>
            {menuHref && (
            <Link
                href={menuHref}
                className="text-muted-foreground hover:text-foreground"
                aria-label={`View all for ${label}`}
            >
                <MoreHorizontal className="h-4 w-4" />
            </Link>
            )}
        </div>

        <p className="mt-3 text-xs text-muted-foreground">{label}</p>

        <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-medium text-foreground">
            {value}
            </span>
            {change && (
            <span
                className={cn(
                "text-xs font-medium",
                change.direction === "up" ? "text-emerald-600" : "text-red-500"
                )}
            >
                {change.direction === "up" ? "+" : "-"}
                {change.value}
            </span>
            )}
        </div>

        {helperText && (
            <p className="mt-0.5 text-xs text-muted-foreground">{helperText}</p>
        )}
        </div>
    );
}