    import { auth } from "@/auth";
    import { redirect } from "next/navigation";
    import { prisma } from "@/lib/prisma";
    import Link from "next/link";

    export default async function TeacherGradesPage() {
    const session = await auth();

    if (!session || session.user?.role !== "TEACHER") {
        redirect("/login");
    }

    const grades = await prisma.grade.findMany({
        orderBy: { createdAt: "desc" },
        include: { student: true },
    });

    return (
        <main className="flex min-h-screen flex-col items-center gap-6 py-16 bg-white dark:bg-black">
        <h1 className="text-3xl font-bold text-black dark:text-white">Grades</h1>

        <Link
            href="/dashboard/teacher/grades/new"
            className="rounded bg-black dark:bg-white px-4 py-2 text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200"
        >
            + Add Grade
        </Link>

        <table className="w-full max-w-2xl border-collapse">
            <thead>
            <tr className="border-b border-zinc-200 dark:border-zinc-800 text-left">
                <th className="p-2 text-black dark:text-white">Student</th>
                <th className="p-2 text-black dark:text-white">Subject</th>
                <th className="p-2 text-black dark:text-white">Term</th>
                <th className="p-2 text-black dark:text-white">Score</th>
            </tr>
            </thead>
            <tbody>
            {grades.map((grade) => (
                <tr key={grade.id} className="border-b border-zinc-100 dark:border-zinc-900">
                <td className="p-2 text-black dark:text-white">{grade.student.name}</td>
                <td className="p-2 text-zinc-600 dark:text-zinc-400">{grade.subject}</td>
                <td className="p-2 text-zinc-600 dark:text-zinc-400">{grade.term}</td>
                <td className="p-2 text-zinc-600 dark:text-zinc-400">{grade.score}</td>
                </tr>
            ))}
            </tbody>
        </table>
        </main>
    );
}