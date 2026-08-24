    import { auth } from "@/auth";
    import { redirect } from "next/navigation";
    import { prisma } from "@/lib/prisma";
    import Link from "next/link";
    import { UserPlus } from "lucide-react";
    import { StatCard } from "@/components/Statcard";
    import { GraduationCap, TrendingUp } from "lucide-react";
    import { ResponsiveHeaderRow } from "@/components/Responsiveheaderrow";
    import LiveSearch from "@/components/LiveSearch";
    import { StudentsTable } from "@/components/StudentsTable";

    const PAGE_SIZE = 5;

    export default async function AdminStudentsPage({
    searchParams,
    }: {
    searchParams: Promise<{ search?: string; page?: string }>;
    }) {
    const session = await auth();

    if (!session || session.user?.role !== "ADMIN") {
        redirect("/login");
    }

    const { search, page } = await searchParams;
    const currentPage = Number(page) || 1;

    const where = {
        name: search ? { contains: search, mode: "insensitive" as const } : undefined,
    };

    const totalStudents = await prisma.student.count({ where });
    const totalPages = Math.ceil(totalStudents / PAGE_SIZE);

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const newEnrollments = await prisma.student.count({
        where: { createdAt: { gte: thirtyDaysAgo } },
    });

    const students = await prisma.student.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (currentPage - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
        include: { class: true },
    });

    function buildPageLink(targetPage: number) {
        const params = new URLSearchParams();
        if (search) params.set("search", search);
        params.set("page", String(targetPage));
        return `/dashboard/admin/students?${params.toString()}`;
    }

    function initials(name: string) {
        return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
    }

    return (
        <main className="min-h-screen bg-background p-5 sm:p-8">
        <ResponsiveHeaderRow
            left={
            <div>
                <p className="text-xs text-primary font-medium">School directory</p>
                <h1 className="mt-1 text-2xl sm:text-3xl font-medium text-foreground">
                Students
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                Manage student records and classes.
                </p>
            </div>
            }
            right={
            <Link
                href="/dashboard/admin/students/new"
                className="flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 whitespace-nowrap"
            >
                <UserPlus className="h-4 w-4" />
                Add student
            </Link>
            }
        />
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
            <StatCard
            icon={GraduationCap}
            label="Total students"
            value={totalStudents.toLocaleString()}
            />
            <StatCard
            icon={TrendingUp}
            label="New enrollments"
            value={newEnrollments.toLocaleString()}
            helperText="Last 30 days"
            />
        </div>

        <div className="mt-6 rounded-2xl border border-border bg-card p-4 sm:p-5">
            <div className="mb-4">
                <ResponsiveHeaderRow
                    left={
                    <div>
                        <h2 className="text-sm font-medium text-foreground">
                        All students
                        </h2>
                        <p className="text-xs text-muted-foreground">
                        Browse and manage your student directory.
                        </p>
                    </div>
                    }
                    right={
                    <div className="sm:w-64">
                        <LiveSearch placeholder="Search students..." />
                    </div>
                    }
                />
            </div>

            <StudentsTable
                students={students.map((s) => ({
                    id: s.id,
                    name: s.name,
                    email: s.email,
                    photoUrl: s.photoUrl,
                    className: s.class?.name,
                }))}
                />

            {students.length === 0 && (
            <p className="mt-4 text-sm text-muted-foreground">
                No students match your search.
            </p>
            )}

            {totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between">
                {currentPage > 1 ? (
                <Link
                    href={buildPageLink(currentPage - 1)}
                    className="text-sm text-primary hover:underline"
                >
                    Previous
                </Link>
                ) : (
                <span className="text-sm text-muted-foreground">Previous</span>
                )}

                <span className="text-xs text-muted-foreground">
                Page {currentPage} of {totalPages}
                </span>

                {currentPage < totalPages ? (
                <Link
                    href={buildPageLink(currentPage + 1)}
                    className="text-sm text-primary hover:underline"
                >
                    Next
                </Link>
                ) : (
                <span className="text-sm text-muted-foreground">Next</span>
                )}
            </div>
            )}
        </div>
        </main>
    );
}