    import { auth } from "@/auth";
    import { redirect } from "next/navigation";
    import { prisma } from "@/lib/prisma";

    export default async function StudentDashboard() {
    const session = await auth();

    if (!session || session.user?.role !== "STUDENT") {
        redirect("/login");
    }

    const student = await prisma.student.findUnique({
        where: { userId: Number(session.user.id) },
        include: { grades: true },
    });

    return (
        <main className="flex min-h-screen flex-col items-center gap-6 py-16 bg-white dark:bg-black">
        <h1 className="text-3xl font-bold text-black dark:text-white">Student Dashboard</h1>
        <p className="text-zinc-600 dark:text-zinc-400">Welcome, {session.user?.name}</p>

        {student ? (
            <>
            <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-4 text-center">
                <p className="text-black dark:text-white">Class: {student.className}</p>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm">{student.email}</p>
            </div>

            <div className="w-full max-w-md">
                <h2 className="text-xl font-bold text-black dark:text-white mb-2">My Grades</h2>
                {student.grades.length === 0 ? (
                <p className="text-zinc-500 dark:text-zinc-400 text-sm">No grades recorded yet.</p>
                ) : (
                <table className="w-full border-collapse">
                    <thead>
                    <tr className="border-b border-zinc-200 dark:border-zinc-800 text-left">
                        <th className="p-2 text-black dark:text-white">Subject</th>
                        <th className="p-2 text-black dark:text-white">Term</th>
                        <th className="p-2 text-black dark:text-white">Score</th>
                    </tr>
                    </thead>
                    <tbody>
                    {student.grades.map((grade) => (
                        <tr key={grade.id} className="border-b border-zinc-100 dark:border-zinc-900">
                        <td className="p-2 text-black dark:text-white">{grade.subject}</td>
                        <td className="p-2 text-zinc-600 dark:text-zinc-400">{grade.term}</td>
                        <td className="p-2 text-zinc-600 dark:text-zinc-400">{grade.score}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                )}
            </div>
            </>
        ) : (
            <p className="text-sm text-red-600 dark:text-red-400">
            No student record linked to your account yet.
            </p>
        )}
        </main>
    );
}