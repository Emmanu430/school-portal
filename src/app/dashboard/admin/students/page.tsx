    import { auth } from "@/auth";
    import { redirect } from "next/navigation";
    import { prisma } from "@/lib/prisma";
    import Link from "next/link";

    export default async function AdminStudentsPage() {
    const session = await auth();

    if (!session || session.user?.role !== "ADMIN") {
        redirect("/login");
    }

    const students = await prisma.student.findMany({
        orderBy: { createdAt: "desc" },
    });

    return (
        <main className="flex min-h-screen flex-col items-center gap-6 py-16 bg-background">
        <h1 className="text-3xl font-bold text-foreground">Manage Students</h1>

        <Link
            href="/dashboard/admin/students/new"
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
            + Add Student
        </Link>

        <table className="w-full max-w-2xl border-collapse">
            <thead>
            <tr className="border-b border-border text-left">
                <th className="p-2 text-foreground">Name</th>
                <th className="p-2 text-foreground">Class</th>
                <th className="p-2 text-foreground">Email</th>
            </tr>
            </thead>
            <tbody>
            {students.map((student) => (
                <tr key={student.id} className="border-b border-border">
                <td className="p-2 text-foreground">
                    <Link
                    href={`/dashboard/admin/students/${student.id}/edit`}
                    className="underline hover:text-muted-foreground"
                    >
                    {student.name}
                    </Link>
                </td>
                <td className="p-2 text-muted-foreground">{student.className}</td>
                <td className="p-2 text-muted-foreground">{student.email}</td>
                </tr>
            ))}
            </tbody>
        </table>
        </main>
    );
}