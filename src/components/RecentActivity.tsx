    import { LucideIcon } from "lucide-react";

    interface ActivityItem {
    icon: React.ReactNode;
    title: string;
    meta: string;
    tint: "primary" | "accent" | "chart3";
    }

    const tintClasses: Record<ActivityItem["tint"], string> = {
    primary: "bg-primary/10 text-primary",
    accent: "bg-accent/25 text-accent-foreground",
    chart3: "bg-[color:var(--chart-3)]/10 text-[color:var(--chart-3)]",
    };

    interface RecentActivityProps {
    items: ActivityItem[];
    }

    export function RecentActivity({ items }: RecentActivityProps) {
    return (
        <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
        <h3 className="text-sm font-medium text-foreground mb-3">
            Recent activity
        </h3>

        {items.length === 0 ? (
            <p className="text-xs text-muted-foreground">Nothing recent yet.</p>
        ) : (
            <div className="flex flex-col gap-3">
            {items.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                    tintClasses[item.tint]
                    }`}
                >
                    {item.icon}
                </div>
                <div className="min-w-0">
                    <p className="text-sm text-foreground truncate">
                    {item.title}
                    </p>
                    <p className="text-xs text-muted-foreground">{item.meta}</p>
                </div>
                </div>
            ))}
            </div>
        )}
        </div>
    );
}