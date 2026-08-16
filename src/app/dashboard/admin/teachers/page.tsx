    import { auth } from "@/auth";
    import { redirect } from "next/navigation";
    import { prisma } from "@/lib/prisma";
    import Link from "next/link";

    export default async function AdminTeachersPage() {
    const session = await auth();

    if (!session || session.user?.role !== "ADMIN") {
        redirect("/login");
    }

    const teachers = await prisma.teacher.findMany({
        orderBy: { createdAt: "desc" },
    });

    return (
        <main className="flex min-h-screen flex-col items-center gap-6 py-16 bg-background">
        <h1 className="text-3xl font-bold text-foreground">Manage Teachers</h1>

        <Link
            href="/dashboard/admin/teachers/new"
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
            + Add Teacher
        </Link>

        <table className="w-full max-w-2xl border-collapse">
            <thead>
            <tr className="border-b border-border text-left">
                <th className="p-2 text-foreground">Name</th>
                <th className="p-2 text-foreground">Subject</th>
                <th className="p-2 text-foreground">Email</th>
            </tr>
            </thead>
            <tbody>
            {teachers.map((teacher) => (
                <tr key={teacher.id} className="border-b border-border">
                <td className="p-2 text-foreground">
                    <Link
                    href={`/dashboard/admin/teachers/${teacher.id}/edit`}
                    className="underline hover:text-muted-foreground"
                    >
                    {teacher.name}
                    </Link>
                </td>
                <td className="p-2 text-muted-foreground">{teacher.subject}</td>
                <td className="p-2 text-muted-foreground">{teacher.email}</td>
                </tr>
            ))}
            </tbody>
        </table>
        </main>
    );
}