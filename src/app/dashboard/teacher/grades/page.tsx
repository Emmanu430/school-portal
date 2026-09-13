    import { auth } from "@/auth";
    import { redirect } from "next/navigation";
    import { prisma } from "@/lib/prisma";
    import Link from "next/link";
    import { ClipboardList } from "lucide-react";
    import { GradesTable } from "@/components/GradesTable";

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
        <main className="min-h-screen bg-background p-5 sm:p-8">
        <div className="flex items-center justify-between gap-4">
            <div>
            <p className="text-xs text-primary font-medium">Teaching</p>
            <h1 className="mt-1 text-2xl sm:text-3xl font-medium text-foreground">Grades</h1>
            </div>
            <Link
            href="/dashboard/teacher/grades/new"
            className="flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 whitespace-nowrap shrink-0"
            >
            <ClipboardList className="h-4 w-4" />
            Add grade
            </Link>
        </div>

        <div className="mt-6 rounded-2xl border border-border bg-card p-4 sm:p-5">
            <GradesTable
            grades={grades.map((g) => ({
                id: g.id,
                studentName: g.student.name,
                subject: g.subject,
                term: g.term,
                score: g.score,
            }))}
            />

            {grades.length === 0 && (
            <p className="mt-4 text-sm text-muted-foreground">No grades recorded yet.</p>
            )}
        </div>
        </main>
    );
}