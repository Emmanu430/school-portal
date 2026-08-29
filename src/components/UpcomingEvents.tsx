    import Link from "next/link";

    interface EventItem {
    id: number;
    title: string;
    date: Date;
    description: string | null;
    }

    const badgeTints = ["primary", "accent", "chart3"] as const;

    const tintClasses: Record<(typeof badgeTints)[number], string> = {
    primary: "bg-primary/10 text-primary",
    accent: "bg-accent/25 text-accent-foreground",
    chart3: "bg-[color:var(--chart-3)]/10 text-[color:var(--chart-3)]",
    };

    export function UpcomingEvents({ events }: { events: EventItem[] }) {
    return (
        <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
        <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-foreground">Upcoming events</h3>
            <Link href="/dashboard/admin/events" className="text-xs text-primary hover:underline">
            View all
            </Link>
        </div>

        {events.length === 0 ? (
            <p className="text-xs text-muted-foreground">No upcoming events scheduled.</p>
        ) : (
            <div className="flex flex-col gap-3">
            {events.map((event, i) => {
                const tint = badgeTints[i % badgeTints.length];
                return (
                <div key={event.id} className="flex items-center gap-3">
                    <div className={`flex flex-col items-center justify-center rounded-lg px-2.5 py-1.5 text-center leading-tight ${tintClasses[tint]}`}>
                    <span className="text-[10px] font-medium uppercase">
                        {event.date.toLocaleDateString("en-US", { month: "short" })}
                    </span>
                    <span className="text-sm font-semibold">{event.date.getDate()}</span>
                    </div>
                    <div className="min-w-0">
                    <p className="text-sm text-foreground truncate">{event.title}</p>
                    {event.description && (
                        <p className="text-xs text-muted-foreground truncate">{event.description}</p>
                    )}
                    </div>
                </div>
                );
            })}
            </div>
        )}
        </div>
    );
}