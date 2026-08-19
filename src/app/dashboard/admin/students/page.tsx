    import { auth } from "@/auth";
    import { redirect } from "next/navigation";
    import { prisma } from "@/lib/prisma";
    import Link from "next/link";
    import { ChevronDown, X } from "lucide-react";

    const PAGE_SIZE = 5;

    export default async function AdminStudentsPage({
    searchParams,
    }: {
    searchParams: Promise<{ search?: string; className?: string; page?: string }>;
    }) {
    const session = await auth();

    if (!session || session.user?.role !== "ADMIN") {
        redirect("/login");
    }

    const { search, className, page } = await searchParams;
    const currentPage = Number(page) || 1;

    const where = {
        name: search ? { contains: search, mode: "insensitive" as const } : undefined,
        className: className ? className : undefined,
    };

    const totalStudents = await prisma.student.count({ where });
    const totalPages = Math.ceil(totalStudents / PAGE_SIZE);

    const students = await prisma.student.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (currentPage - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
    });

    const allClasses = await prisma.student.findMany({
        select: { className: true },
        distinct: ["className"],
    });

    function buildPageLink(targetPage: number) {
        const params = new URLSearchParams();
        if (search) params.set("search", search);
        if (className) params.set("className", className);
        params.set("page", String(targetPage));
        return `/dashboard/admin/students?${params.toString()}`;
    }

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

        {totalPages > 1 && (
            <div className="flex items-center gap-4">
            {currentPage > 1 ? (
                <Link href={buildPageLink(currentPage - 1)} className="text-sm text-primary underline">
                Previous
                </Link>
            ) : (
                <span className="text-sm text-muted-foreground">Previous</span>
            )}

            <span className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
            </span>

            {currentPage < totalPages ? (
                <Link href={buildPageLink(currentPage + 1)} className="text-sm text-primary underline">
                Next
                </Link>
            ) : (
                <span className="text-sm text-muted-foreground">Next</span>
            )}
            </div>
        )}
        </main>
    );
}