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
        <main className="flex min-h-screen items-center justify-center bg-white dark:bg-black">
        <form
            action={createGrade}
            className="flex w-full max-w-sm flex-col gap-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6"
        >
            <h1 className="text-2xl font-bold text-black dark:text-white">Add Grade</h1>

            <select
            name="studentId"
            className="rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-black dark:text-white"
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
            className="rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-black dark:text-white placeholder:text-zinc-400"
            required
            />

            <input
            type="text"
            name="term"
            placeholder="Term (e.g. Term 1)"
            className="rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-black dark:text-white placeholder:text-zinc-400"
            required
            />

            <input
            type="number"
            name="score"
            placeholder="Score (0–100)"
            min={0}
            max={100}
            className="rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-black dark:text-white placeholder:text-zinc-400"
            required
            />

            <button
            type="submit"
            className="rounded bg-black dark:bg-white px-4 py-2 text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200"
            >
            Save Grade
            </button>
        </form>
        </main>
    );
}