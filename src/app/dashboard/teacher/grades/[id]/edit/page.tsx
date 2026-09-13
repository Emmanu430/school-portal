    import { auth } from "@/auth";
    import { redirect, notFound } from "next/navigation";
    import { prisma } from "@/lib/prisma";

    export default async function EditGradePage({
    params,
    }: {
    params: Promise<{ id: string }>;
    }) {
    const session = await auth();
    if (!session || session.user?.role !== "TEACHER") {
        redirect("/login");
    }

    const { id } = await params;
    const grade = await prisma.grade.findUnique({
        where: { id: Number(id) },
        include: { student: true },
    });

    if (!grade) {
        notFound();
    }

    const teacher = await prisma.teacher.findUnique({
        where: { userId: Number(session.user.id) },
    });

    if (!teacher?.classId || grade.student.classId !== teacher.classId) {
        redirect("/dashboard/teacher/grades");
    }

    async function updateGrade(formData: FormData) {
        "use server";
        const subject = formData.get("subject") as string;
        const term = formData.get("term") as string;
        const score = Number(formData.get("score"));
        await prisma.grade.update({ where: { id: Number(id) }, data: { subject, term, score } });
        redirect("/dashboard/teacher/grades");
    }

    async function deleteGrade() {
        "use server";
        await prisma.grade.delete({ where: { id: Number(id) } });
        redirect("/dashboard/teacher/grades");
    }

    return (
        <main className="min-h-screen bg-background p-5 sm:p-8 flex items-center justify-center">
        <div className="flex w-full max-w-sm flex-col gap-4">
            <form
            action={updateGrade}
            className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6"
            >
            <div>
                <p className="text-xs text-primary font-medium">Teaching</p>
                <h1 className="mt-1 text-xl font-medium text-foreground">Edit grade</h1>
                <p className="text-xs text-muted-foreground mt-1">Student: {grade.student.name}</p>
            </div>

            <div>
                <label className="text-xs text-muted-foreground">Subject</label>
                <input
                type="text"
                name="subject"
                defaultValue={grade.subject}
                className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground"
                required
                />
            </div>

            <div>
                <label className="text-xs text-muted-foreground">Term</label>
                <input
                type="text"
                name="term"
                defaultValue={grade.term}
                className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground"
                required
                />
            </div>

            <div>
                <label className="text-xs text-muted-foreground">Score (0–100)</label>
                <input
                type="number"
                name="score"
                defaultValue={grade.score}
                min={0}
                max={100}
                className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground"
                required
                />
            </div>

            <button
                type="submit"
                className="rounded-full bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
                Save changes
            </button>
            </form>

            <form action={deleteGrade}>
            <button
                type="submit"
                className="w-full rounded-full bg-destructive px-4 py-2.5 text-sm font-medium text-destructive-foreground hover:bg-destructive/90"
            >
                Delete grade
            </button>
            </form>
        </div>
        </main>
    );
}