    import Link from "next/link";
    import { LucideIcon } from "lucide-react";

    interface QuickAction {
    href: string;
    icon: React.ReactNode;
    label: string;
    tint: "primary" | "accent" | "chart3" | "secondary";
    }

    const tintClasses: Record<QuickAction["tint"], string> = {
    primary: "bg-primary/10 text-primary",
    accent: "bg-accent/25 text-accent-foreground",
    chart3: "bg-[color:var(--chart-3)]/10 text-[color:var(--chart-3)]",
    secondary: "bg-secondary text-secondary-foreground",
    };

    interface QuickActionsProps {
    actions: {
        href: string;
        icon: React.ReactNode;
        label: string;
        tint: QuickAction["tint"];
    }[];
    }

    export function QuickActions({ actions }: QuickActionsProps) {
    return (
        <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
        <h3 className="text-sm font-medium text-foreground mb-3">
            Quick actions
        </h3>
        <div className="grid grid-cols-2 gap-2.5">
            {actions.map((action) => (
            <Link
                key={action.href}
                href={action.href}
                className={`flex flex-col gap-2 rounded-xl p-3 text-xs font-medium transition-opacity hover:opacity-80 ${
                tintClasses[action.tint]
                }`}
            >
                {action.icon}
                {action.label}
            </Link>
            ))}
        </div>
        </div>
    );
}