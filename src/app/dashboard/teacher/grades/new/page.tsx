    import { auth } from "@/auth";
    import { redirect } from "next/navigation";
    import { prisma } from "@/lib/prisma";

    export default async function NewGradePage() {
    const session = await auth();

    if (!session || session.user?.role !== "TEACHER") {
        redirect("/login");
    }

    const students = await prisma.student.findMany({
        orderBy: { name: "asc" },
    });

    async function createGrade(formData: FormData) {
        "use server";

        const studentId = Number(formData.get("studentId"));
        const subject = formData.get("subject") as string;
        const term = formData.get("term") as string;
        const score = Number(formData.get("score"));

        await prisma.grade.create({
        data: { studentId, subject, term, score },
        });

        redirect("/dashboard/teacher/grades");
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-background">
        <form
            action={createGrade}
            className="flex w-full max-w-sm flex-col gap-4 rounded-lg border border-border bg-card p-6"
        >
            <h1 className="text-2xl font-bold text-foreground">Add Grade</h1>

            <select
            name="studentId"
            className="rounded border border-border bg-input px-3 py-2 text-foreground"
            required
            defaultValue=""
            >
            <option value="" disabled>Select a student</option>
            {students.map((student) => (
                <option key={student.id} value={student.id}>
                {student.name} ({student.className})
                </option>
            ))}
            </select>

            <input
            type="text"
            name="subject"
            placeholder="Subject (e.g. Mathematics)"
            className="rounded border border-border bg-input px-3 py-2 text-foreground placeholder:text-muted-foreground"
            required
            />

            <input
            type="text"
            name="term"
            placeholder="Term (e.g. Term 1)"
            className="rounded border border-border bg-input px-3 py-2 text-foreground placeholder:text-muted-foreground"
            required
            />

            <input
            type="number"
            name="score"
            placeholder="Score (0–100)"
            min={0}
            max={100}
            className="rounded border border-border bg-input px-3 py-2 text-foreground placeholder:text-muted-foreground"
            required
            />

            <button
            type="submit"
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
            Save Grade
            </button>
        </form>
        </main>
    );
}