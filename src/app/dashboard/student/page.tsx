    import { auth } from "@/auth";
    import { redirect } from "next/navigation";
    import { prisma } from "@/lib/prisma";
    import { GraduationCap, ClipboardCheck, TrendingUp } from "lucide-react";
    import { StatCard } from "@/components/Statcard";

    const statusStyles: Record<string, string> = {
    PRESENT: "bg-primary/10 text-primary",
    ABSENT: "bg-destructive/10 text-destructive",
    LATE: "bg-accent/25 text-accent-foreground",
    };

    export default async function StudentDashboard() {
    const session = await auth();

    if (!session || session.user?.role !== "STUDENT") {
        redirect("/login");
    }

    const student = await prisma.student.findUnique({
        where: { userId: Number(session.user.id) },
        include: {
        grades: true,
        class: true,
        attendance: { orderBy: { date: "desc" } },
        },
    });

    const presentCount = student?.attendance.filter(
        (a) => a.status === "PRESENT" || a.status === "LATE"
    ).length ?? 0;
    const attendanceRate =
        student && student.attendance.length > 0
        ? Math.round((presentCount / student.attendance.length) * 100)
        : null;

    const averageScore =
        student && student.grades.length > 0
        ? Math.round(student.grades.reduce((sum, g) => sum + g.score, 0) / student.grades.length)
        : null;

    function initials(name: string) {
        return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
    }

    return (
        <main className="min-h-screen bg-background p-5 sm:p-8">
        <p className="text-xs text-primary font-medium">My portal</p>
        <h1 className="mt-1 text-2xl sm:text-3xl font-medium text-foreground">
            Welcome, {session.user?.name?.split(" ")[0] ?? "Student"}
        </h1>

        {student ? (
            <>
            <div className="mt-6 flex items-center gap-3">
                {student.photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={student.photoUrl} alt={student.name} className="h-14 w-14 rounded-full object-cover border border-border" />
                ) : (
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                    {initials(student.name)}
                </div>
                )}
                <div>
                <p className="text-sm font-medium text-foreground">{student.name}</p>
                <p className="text-xs text-muted-foreground">
                    {student.class?.name ?? "No class assigned"} · {student.email}
                </p>
                </div>
            </div>

            <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
                <StatCard icon={GraduationCap} label="Class" value={student.class?.name ?? "—"} />
                <StatCard icon={ClipboardCheck} label="Attendance rate" value={attendanceRate !== null ? `${attendanceRate}%` : "—"} />
                <StatCard icon={TrendingUp} label="Average score" value={averageScore !== null ? averageScore : "—"} />
            </div>

            <div className="mt-6 rounded-2xl border border-border bg-card p-4 sm:p-5">
                <h2 className="text-sm font-medium text-foreground mb-3">My grades</h2>
                {student.grades.length === 0 ? (
                <p className="text-xs text-muted-foreground">No grades recorded yet.</p>
                ) : (
                <table className="w-full border-collapse">
                    <thead>
                    <tr className="border-b border-border text-left">
                        <th className="py-2 pr-4 text-xs font-medium text-muted-foreground">Subject</th>
                        <th className="py-2 pr-4 text-xs font-medium text-muted-foreground">Term</th>
                        <th className="py-2 pr-4 text-xs font-medium text-muted-foreground">Score</th>
                    </tr>
                    </thead>
                    <tbody>
                    {student.grades.map((grade) => (
                        <tr key={grade.id} className="border-b border-border last:border-0">
                        <td className="py-3 pr-4 text-sm text-foreground">{grade.subject}</td>
                        <td className="py-3 pr-4 text-sm text-muted-foreground">{grade.term}</td>
                        <td className="py-3 pr-4 text-sm text-muted-foreground">{grade.score}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                )}
            </div>

            <div className="mt-6 rounded-2xl border border-border bg-card p-4 sm:p-5">
                <h2 className="text-sm font-medium text-foreground mb-3">My attendance</h2>
                {student.attendance.length === 0 ? (
                <p className="text-xs text-muted-foreground">No attendance recorded yet.</p>
                ) : (
                <div className="flex flex-col gap-1">
                    {student.attendance.slice(0, 10).map((record) => (
                    <div key={record.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                        <span className="text-sm text-foreground">
                        {record.date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </span>
                        <span className={`text-xs font-medium rounded-full px-2.5 py-1 ${statusStyles[record.status] ?? "bg-muted text-muted-foreground"}`}>
                        {record.status.charAt(0) + record.status.slice(1).toLowerCase()}
                        </span>
                    </div>
                    ))}
                </div>
                )}
            </div>
            </>
        ) : (
            <p className="mt-6 text-sm text-destructive">No student record linked to your account yet.</p>
        )}
        </main>
    );
}