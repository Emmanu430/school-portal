    import { auth } from "@/auth";
    import { redirect } from "next/navigation";
    import { prisma } from "@/lib/prisma";

    const statusStyles: Record<string, string> = {
    PRESENT: "bg-primary/10 text-primary",
    ABSENT: "bg-destructive/10 text-destructive",
    LATE: "bg-accent/25 text-accent-foreground",
    };

    export default async function ViewAttendancePage({
    searchParams,
    }: {
    searchParams: Promise<{ date?: string }>;
    }) {
    const session = await auth();

    if (!session || session.user?.role !== "TEACHER") {
        redirect("/login");
    }

    const { date } = await searchParams;
    const selectedDate = date ?? new Date().toISOString().split("T")[0];

    const teacher = await prisma.teacher.findUnique({
        where: { userId: Number(session.user.id) },
    });

    const records = teacher?.classId
        ? await prisma.attendance.findMany({
            where: { date: new Date(selectedDate), student: { classId: teacher.classId } },
            include: { student: true },
            orderBy: { student: { name: "asc" } },
        })
        : [];

    return (
        <main className="min-h-screen bg-background p-5 sm:p-8">
        <p className="text-xs text-primary font-medium">Teaching</p>
        <h1 className="mt-1 text-2xl sm:text-3xl font-medium text-foreground">View attendance</h1>

        <form method="GET" className="mt-4 flex gap-2 max-w-sm">
            <input
            type="date"
            name="date"
            defaultValue={selectedDate}
            className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground [color-scheme:light] dark:[color-scheme:dark]"
            />
            <button
            type="submit"
            className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 whitespace-nowrap"
            >
            Load date
            </button>
        </form>

        <div className="mt-6 max-w-md rounded-2xl border border-border bg-card p-4 sm:p-5">
            {!teacher?.classId ? (
            <p className="text-sm text-destructive">You have no assigned class yet. Contact an admin.</p>
            ) : records.length === 0 ? (
            <p className="text-sm text-muted-foreground">No attendance recorded for this date yet.</p>
            ) : (
            <div className="flex flex-col gap-1">
                {records.map((record) => (
                <div key={record.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <span className="text-sm text-foreground">{record.student.name}</span>
                    <span className={`text-xs font-medium rounded-full px-2.5 py-1 ${statusStyles[record.status] ?? "bg-muted text-muted-foreground"}`}>
                    {record.status.charAt(0) + record.status.slice(1).toLowerCase()}
                    </span>
                </div>
                ))}
            </div>
            )}
        </div>
        </main>
    );
}