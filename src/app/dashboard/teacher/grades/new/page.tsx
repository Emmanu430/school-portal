    import { auth } from "@/auth";
    import { redirect } from "next/navigation";
    import { prisma } from "@/lib/prisma";
    import FormSelect from "@/components/FormSelect";

    export default async function NewGradePage() {
    const session = await auth();

    if (!session || session.user?.role !== "TEACHER") {
        redirect("/login");
    }

    const teacher = await prisma.teacher.findUnique({
        where: { userId: Number(session.user.id) },
    });

    const students = await prisma.student.findMany({
        where: teacher?.classId ? { classId: teacher.classId } : { id: -1 },
        orderBy: { name: "asc" },
        include: { class: true },
    });

    async function createGrade(formData: FormData) {
        "use server";
        const studentId = Number(formData.get("studentId"));
        const subject = formData.get("subject") as string;
        const term = formData.get("term") as string;
        const score = Number(formData.get("score"));
        await prisma.grade.create({ data: { studentId, subject, term, score } });
        redirect("/dashboard/teacher/grades");
    }

    return (
        <main className="min-h-screen bg-background p-5 sm:p-8 flex items-center justify-center">
        <form
            action={createGrade}
            className="flex w-full max-w-sm flex-col gap-4 rounded-2xl border border-border bg-card p-6"
        >
            <div>
            <p className="text-xs text-primary font-medium">Teaching</p>
            <h1 className="mt-1 text-xl font-medium text-foreground">Add grade</h1>
            </div>

            {!teacher?.classId && (
            <p className="text-xs text-destructive">You have no assigned class yet. Contact an admin.</p>
            )}

            <div>
            <label className="text-xs text-muted-foreground">Student</label>
            <div className="mt-1">
                <FormSelect
                name="studentId"
                placeholder="Select a student"
                options={students.map((s) => ({
                    value: String(s.id),
                    label: `${s.name} (${s.class?.name ?? "—"})`,
                }))}
                />
            </div>
            </div>

            <div>
            <label className="text-xs text-muted-foreground">Subject</label>
            <input
                type="text"
                name="subject"
                placeholder="e.g. Mathematics"
                className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground"
                required
            />
            </div>

            <div>
            <label className="text-xs text-muted-foreground">Term</label>
            <input
                type="text"
                name="term"
                placeholder="e.g. Term 1"
                className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground"
                required
            />
            </div>

            <div>
            <label className="text-xs text-muted-foreground">Score (0–100)</label>
            <input
                type="number"
                name="score"
                min={0}
                max={100}
                className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground"
                required
            />
            </div>

            <button
            type="submit"
            className="rounded-full bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
            Save grade
            </button>
        </form>
        </main>
    );
}