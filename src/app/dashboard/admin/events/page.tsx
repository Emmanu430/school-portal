    import { auth } from "@/auth";
    import { redirect } from "next/navigation";
    import { prisma } from "@/lib/prisma";
    import { revalidatePath } from "next/cache";
    import { Calendar } from "lucide-react";
    import { StatCard } from "@/components/Statcard";

    export default async function AdminEventsPage() {
    const session = await auth();

    if (!session || session.user?.role !== "ADMIN") {
        redirect("/login");
    }

    const events = await prisma.event.findMany({ orderBy: { date: "asc" } });
    const upcomingCount = events.filter((e) => e.date >= new Date()).length;

    async function addEvent(formData: FormData) {
        "use server";
        const title = formData.get("title") as string;
        const date = formData.get("date") as string;
        const description = formData.get("description") as string;
        if (!title?.trim() || !date) return;

        await prisma.event.create({
        data: {
            title: title.trim(),
            date: new Date(date),
            description: description?.trim() || null,
        },
        });
        revalidatePath("/dashboard/admin/events");
    }

    async function deleteEvent(formData: FormData) {
        "use server";
        const id = Number(formData.get("id"));
        await prisma.event.delete({ where: { id } });
        revalidatePath("/dashboard/admin/events");
    }

    return (
        <main className="min-h-screen bg-background p-5 sm:p-8">
        <p className="text-xs text-primary font-medium">School directory</p>
        <h1 className="mt-1 text-2xl sm:text-3xl font-medium text-foreground">Events</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage school events and announcements.</p>

        <div className="mt-6 max-w-xs">
            <StatCard icon={Calendar} label="Upcoming events" value={upcomingCount.toLocaleString()} />
        </div>

        <div className="mt-6 max-w-xl rounded-2xl border border-border bg-card p-4 sm:p-5">
            <form action={addEvent} className="flex flex-col gap-3 mb-4">
            <div>
                <label className="text-xs text-muted-foreground">Title</label>
                <input
                type="text"
                name="title"
                placeholder="e.g. Parent-teacher conference"
                className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground"
                required
                />
            </div>
            <div>
                <label className="text-xs text-muted-foreground">Date</label>
                <input
                type="date"
                name="date"
                className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground"
                required
                />
            </div>
            <div>
                <label className="text-xs text-muted-foreground">Description (optional)</label>
                <input
                type="text"
                name="description"
                placeholder="Short note about the event"
                className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground"
                />
            </div>
            <button
                type="submit"
                className="rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 self-start"
            >
                Add event
            </button>
            </form>

            <div className="flex flex-col gap-2">
            {events.map((event) => (
                <div key={event.id} className="flex items-center justify-between rounded-lg border border-border px-3 py-2.5">
                <div>
                    <p className="text-sm font-medium text-foreground">{event.title}</p>
                    <p className="text-xs text-muted-foreground">
                    {event.date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    {event.description ? ` · ${event.description}` : ""}
                    </p>
                </div>
                <form action={deleteEvent}>
                    <input type="hidden" name="id" value={event.id} />
                    <button type="submit" className="text-xs text-destructive hover:underline">Delete</button>
                </form>
                </div>
            ))}
            </div>

            {events.length === 0 && (
            <p className="text-sm text-muted-foreground">No events yet — add one above.</p>
            )}
        </div>
        </main>
    );
}