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
        include: {
        grades: true,
        class: true,
        attendance: { orderBy: { date: "desc" } },
        },
    });

    return (
        <main className="flex min-h-screen flex-col items-center gap-6 py-16 bg-background">
        <h1 className="text-3xl font-bold text-foreground">Student Dashboard</h1>
        <p className="text-muted-foreground">Welcome, {session.user?.name}</p>

        {student ? (
            <>
            <div className="rounded-lg border border-border p-4 text-center flex flex-col items-center gap-2">
                {student.photoUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                    src={student.photoUrl}
                    alt={student.name}
                    className="h-20 w-20 rounded-full object-cover border border-border"
                />
                )}
                <p className="text-foreground">Class: {student.class?.name ?? "—"}</p>
                <p className="text-muted-foreground text-sm">{student.email}</p>
            </div>

            <div className="w-full max-w-md">
                <h2 className="text-xl font-bold text-foreground mb-2">My Grades</h2>
                {student.grades.length === 0 ? (
                <p className="text-muted-foreground text-sm">No grades recorded yet.</p>
                ) : (
                <table className="w-full border-collapse">
                    <thead>
                    <tr className="border-b border-border text-left">
                        <th className="p-2 text-foreground">Subject</th>
                        <th className="p-2 text-foreground">Term</th>
                        <th className="p-2 text-foreground">Score</th>
                    </tr>
                    </thead>
                    <tbody>
                    {student.grades.map((grade) => (
                        <tr key={grade.id} className="border-b border-border">
                        <td className="p-2 text-foreground">{grade.subject}</td>
                        <td className="p-2 text-muted-foreground">{grade.term}</td>
                        <td className="p-2 text-muted-foreground">{grade.score}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                )}
            </div>

            <div className="w-full max-w-md">
                <h2 className="text-xl font-bold text-foreground mb-2">My Attendance</h2>
                {student.attendance.length === 0 ? (
                <p className="text-muted-foreground text-sm">No attendance recorded yet.</p>
                ) : (
                <table className="w-full border-collapse">
                    <thead>
                    <tr className="border-b border-border text-left">
                        <th className="p-2 text-foreground">Date</th>
                        <th className="p-2 text-foreground">Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    {student.attendance.map((record) => (
                        <tr key={record.id} className="border-b border-border">
                        <td className="p-2 text-foreground">
                            {record.date.toLocaleDateString()}
                        </td>
                        <td className="p-2 text-muted-foreground">{record.status}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                )}
            </div>
            </>
        ) : (
            <p className="text-sm text-destructive">
            No student record linked to your account yet.
            </p>
        )}
        </main>
    );
}