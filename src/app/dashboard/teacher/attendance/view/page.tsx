    import { auth } from "@/auth";
    import { redirect } from "next/navigation";
    import { prisma } from "@/lib/prisma";

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
            where: {
            date: new Date(selectedDate),
            student: { classId: teacher.classId },
            },
            include: { student: true },
            orderBy: { student: { name: "asc" } },
        })
        : [];

    return (
        <main className="flex min-h-screen flex-col items-center gap-6 py-16 bg-background">
        <h1 className="text-3xl font-bold text-foreground">View Attendance</h1>

        <form method="GET" className="flex gap-2">
            <input
            type="date"
            name="date"
            defaultValue={selectedDate}
            className="rounded border border-border bg-input px-3 py-2 text-foreground [color-scheme:light] dark:[color-scheme:dark]"
            />
            <button
            type="submit"
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
            Load Date
            </button>
        </form>

        {!teacher?.classId ? (
            <p className="text-sm text-destructive">
            You have no assigned class yet. Contact an admin.
            </p>
        ) : records.length === 0 ? (
            <p className="text-sm text-muted-foreground">
            No attendance recorded for this date yet.
            </p>
        ) : (
            <table className="w-full max-w-md border-collapse">
            <thead>
                <tr className="border-b border-border text-left">
                <th className="p-2 text-foreground">Student</th>
                <th className="p-2 text-foreground">Status</th>
                </tr>
            </thead>
            <tbody>
                {records.map((record) => (
                <tr key={record.id} className="border-b border-border">
                    <td className="p-2 text-foreground">{record.student.name}</td>
                    <td className="p-2 text-muted-foreground">{record.status}</td>
                </tr>
                ))}
            </tbody>
            </table>
        )}
        </main>
    );
}