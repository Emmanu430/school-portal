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
        if (!teacher?.assignedClass || grade.student.className !== teacher.assignedClass) {
            redirect("/dashboard/teacher/grades");
        }

    async function updateGrade(formData: FormData) {
        "use server";

        const subject = formData.get("subject") as string;
        const term = formData.get("term") as string;
        const score = Number(formData.get("score"));

        await prisma.grade.update({
        where: { id: Number(id) },
        data: { subject, term, score },
        });

        redirect("/dashboard/teacher/grades");
    }

    async function deleteGrade() {
        "use server";

        await prisma.grade.delete({
        where: { id: Number(id) },
        });

        redirect("/dashboard/teacher/grades");
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex w-full max-w-sm flex-col gap-4">
            <form
            action={updateGrade}
            className="flex flex-col gap-4 rounded-lg border border-border bg-card p-6"
            >
            <h1 className="text-2xl font-bold text-foreground">Edit Grade</h1>
            <p className="text-sm text-muted-foreground -mt-2">
                Student: {grade.student.name}
            </p>

            <input
                type="text"
                name="subject"
                defaultValue={grade.subject}
                className="rounded border border-border bg-input px-3 py-2 text-foreground"
                required
            />

            <input
                type="text"
                name="term"
                defaultValue={grade.term}
                className="rounded border border-border bg-input px-3 py-2 text-foreground"
                required
            />

            <input
                type="number"
                name="score"
                defaultValue={grade.score}
                min={0}
                max={100}
                className="rounded border border-border bg-input px-3 py-2 text-foreground"
                required
            />

            <button
                type="submit"
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
                Save Changes
            </button>
            </form>

            <form action={deleteGrade}>
            <button
                type="submit"
                className="w-full rounded-md bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground hover:bg-destructive/90"
            >
                Delete Grade
            </button>
            </form>
        </div>
        </main>
    );
}