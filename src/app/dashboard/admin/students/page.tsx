    import { auth } from "@/auth";
    import { redirect } from "next/navigation";
    import { prisma } from "@/lib/prisma";
    import Link from "next/link";
    import { ChevronDown } from "lucide-react";
    import { X } from "lucide-react";
    export default async function AdminStudentsPage({
    searchParams,
    }: {
    searchParams: Promise<{ search?: string; className?: string }>;
    }) {
    const session = await auth();

    if (!session || session.user?.role !== "ADMIN") {
        redirect("/login");
    }

    const { search, className } = await searchParams;

    const students = await prisma.student.findMany({
        where: {
        name: search ? { contains: search, mode: "insensitive" } : undefined,
        className: className ? className : undefined,
        },
        orderBy: { createdAt: "desc" },
    });

    const allClasses = await prisma.student.findMany({
        select: { className: true },
        distinct: ["className"],
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

        <form className="flex w-full max-w-2xl gap-2" method="GET">
            <input
            type="text"
            name="search"
            defaultValue={search}
            placeholder="Search by name..."
            className="flex-1 rounded border border-border bg-input px-3 py-2 text-foreground placeholder:text-muted-foreground"
            />

            <div className="relative">
                <select
                    name="className"
                    defaultValue={className ?? ""}
                    className="appearance-none rounded border border-border bg-input px-3 py-2 pr-8 text-foreground"
                >
                    <option value="">All Classes</option>
                    {allClasses.map((c) => (
                    <option key={c.className} value={c.className}>
                        {c.className}
                    </option>
                    ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>

            <button
            type="submit"
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
            Filter
            </button>
        </form>
            {(search || className) && (
                <Link
                    href="/dashboard/admin/students"
                    className="flex items-center gap-1 rounded-full border border-border bg-muted px-3 py-1 text-xs text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
                >
                    <X className="h-3 w-3" />
                    Clear filters
                </Link>
                )}
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

        {students.length === 0 && (
            <p className="text-muted-foreground">No students match your search.</p>
        )}
        </main>
    );
}