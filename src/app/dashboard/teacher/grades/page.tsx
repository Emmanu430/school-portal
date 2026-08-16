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
        <main className="flex min-h-screen flex-col items-center gap-6 py-16 bg-background">
        <h1 className="text-3xl font-bold text-foreground">Grades</h1>

        <Link
            href="/dashboard/teacher/grades/new"
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
            + Add Grade
        </Link>

        <table className="w-full max-w-2xl border-collapse">
            <thead>
            <tr className="border-b border-border text-left">
                <th className="p-2 text-foreground">Student</th>
                <th className="p-2 text-foreground">Subject</th>
                <th className="p-2 text-foreground">Term</th>
                <th className="p-2 text-foreground">Score</th>
            </tr>
            </thead>
            <tbody>
            {grades.map((grade) => (
                <tr key={grade.id} className="border-b border-border">
                <td className="p-2 text-foreground">{grade.student.name}</td>
                <td className="p-2 text-muted-foreground">
                    <Link
                    href={`/dashboard/teacher/grades/${grade.id}/edit`}
                    className="underline hover:text-foreground"
                    >
                    {grade.subject}
                    </Link>
                </td>
                <td className="p-2 text-muted-foreground">{grade.term}</td>
                <td className="p-2 text-muted-foreground">{grade.score}</td>
                </tr>
            ))}
            </tbody>
        </table>
        </main>
    );
}