    import { auth } from "@/auth";
    import { redirect } from "next/navigation";
    import { prisma } from "@/lib/prisma";
    import FormSelect from "@/components/FormSelect";

    export default async function AttendancePage({
    searchParams,
    }: {
    searchParams: Promise<{ date?: string; success?: string }>;
    }) {
    const session = await auth();

    if (!session || session.user?.role !== "TEACHER") {
        redirect("/login");
    }

    const { date, success } = await searchParams;
    const selectedDate = date ?? new Date().toISOString().split("T")[0];

    const teacher = await prisma.teacher.findUnique({
        where: { userId: Number(session.user.id) },
    });

    const students = teacher?.classId
        ? await prisma.student.findMany({
            where: { classId: teacher.classId },
            orderBy: { name: "asc" },
        })
        : [];

    const existingRecords = await prisma.attendance.findMany({
        where: {
        date: new Date(selectedDate),
        studentId: { in: students.map((s) => s.id) },
        },
    });

    async function markAttendance(formData: FormData) {
        "use server";

        const dateValue = formData.get("date") as string;
        const teacherRecord = await prisma.teacher.findUnique({
        where: { userId: Number(session!.user.id) },
        });

        for (const student of students) {
        const status = formData.get(`status-${student.id}`) as string;
        if (!status) continue;

        await prisma.attendance.upsert({
            where: {
            studentId_date: {
                studentId: student.id,
                date: new Date(dateValue),
            },
            },
            update: { status: status as "PRESENT" | "ABSENT" | "LATE", teacherId: teacherRecord?.id },
            create: {
            studentId: student.id,
            date: new Date(dateValue),
            status: status as "PRESENT" | "ABSENT" | "LATE",
            teacherId: teacherRecord?.id,
            },
        });
        }

        redirect(`/dashboard/teacher/attendance?date=${dateValue}&success=1`);
    }

    return (
        <main className="flex min-h-screen flex-col items-center gap-6 py-16 bg-background">
        <h1 className="text-3xl font-bold text-foreground">Mark Attendance</h1>

        {success === "1" && (
            <p className="text-sm text-primary">Attendance saved successfully.</p>
        )}

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
        ) : (
            <form action={markAttendance} className="flex w-full max-w-md flex-col gap-4">
            <input type="hidden" name="date" value={selectedDate} />

            <div className="rounded-lg border border-border bg-card p-4 flex flex-col gap-3">
                {students.map((student) => {
                const existing = existingRecords.find((r) => r.studentId === student.id);
                return (
                    <div key={student.id} className="flex items-center justify-between gap-2">
                    <span className="text-foreground">{student.name}</span>
                    <div className="w-32">
                        <FormSelect
                            name={`status-${student.id}`}
                            defaultValue={existing?.status ?? "PRESENT"}
                            options={[
                            { value: "PRESENT", label: "Present" },
                            { value: "ABSENT", label: "Absent" },
                            { value: "LATE", label: "Late" },
                            ]}
                        />
                        </div>
                    </div>
                );
                })}
            </div>

            <button
                type="submit"
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
                Save Attendance
            </button>
            </form>
        )}
        </main>
    );
}