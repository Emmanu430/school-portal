    import { auth } from "@/auth";
    import { redirect } from "next/navigation";
    import { prisma } from "@/lib/prisma";
    import Link from "next/link";
    import { ChevronDown } from "lucide-react";
    import { X } from "lucide-react";
    export default async function AdminTeachersPage({
    searchParams,
    }: {
    searchParams: Promise<{ search?: string; subject?: string }>;
    }) {
    const session = await auth();

    if (!session || session.user?.role !== "ADMIN") {
        redirect("/login");
    }

    const { search, subject } = await searchParams;

    const teachers = await prisma.teacher.findMany({
        where: {
        name: search ? { contains: search, mode: "insensitive" } : undefined,
        subject: subject ? subject : undefined,
        },
        orderBy: { createdAt: "desc" },
    });

    const allSubjects = await prisma.teacher.findMany({
        select: { subject: true },
        distinct: ["subject"],
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
                name="subject"
                defaultValue={subject ?? ""}
                className="appearance-none rounded border border-border bg-input px-3 py-2 pr-8 text-foreground"
            >
                <option value="">All Subjects</option>
                {allSubjects.map((s) => (
                <option key={s.subject} value={s.subject}>
                    {s.subject}
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

        {((search || subject) && (
            <Link
                href="/dashboard/admin/teachers"
                className="flex items-center gap-1 rounded-full border border-border bg-muted px-3 py-1 text-xs text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
            >
                <X className="h-3 w-3" />
                Clear filters
            </Link>
        ))}

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

        {teachers.length === 0 && (
            <p className="text-muted-foreground">No teachers match your search.</p>
        )}
        </main>
    );
}