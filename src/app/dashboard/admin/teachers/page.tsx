    import { auth } from "@/auth";
    import { redirect } from "next/navigation";
    import { prisma } from "@/lib/prisma";
    import Link from "next/link";
    import { UserPlus, GraduationCap } from "lucide-react";
    import { StatCard } from "@/components/Statcard";
    import { ResponsiveHeaderRow } from "@/components/Responsiveheaderrow";
    import LiveSearch from "@/components/LiveSearch";
    import { TeachersTable } from "@/components/TeachersTable";

    export default async function AdminTeachersPage({
    searchParams,
    }: {
    searchParams: Promise<{ search?: string }>;
    }) {
    const session = await auth();

    if (!session || session.user?.role !== "ADMIN") {
        redirect("/login");
    }

    const { search } = await searchParams;

    const teachers = await prisma.teacher.findMany({
        where: {
        name: search ? { contains: search, mode: "insensitive" } : undefined,
        },
        orderBy: { createdAt: "desc" },
    });

    const totalTeachers = teachers.length;

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const newTeachers = await prisma.teacher.count({
    where: { createdAt: { gte: thirtyDaysAgo } },
    });

    return (
        <main className="min-h-screen bg-background p-5 sm:p-8">
        <ResponsiveHeaderRow
            left={
            <div>
                <p className="text-xs text-primary font-medium">School directory</p>
                <h1 className="mt-1 text-2xl sm:text-3xl font-medium text-foreground">
                Teachers
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                Manage teaching staff and subjects.
                </p>
            </div>
            }
            right={
            <Link
                href="/dashboard/admin/teachers/new"
                className="flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 whitespace-nowrap"
            >
                <UserPlus className="h-4 w-4" />
                Add teacher
            </Link>
            }
        />

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
            <StatCard
            icon={GraduationCap}
            label="Total teachers"
            value={totalTeachers.toLocaleString()}
            />
            <StatCard
            icon={UserPlus}
            label="New teachers"
            value={newTeachers.toLocaleString()}
            helperText="Last 30 days"
            />
        </div>

        <div className="mt-6 rounded-2xl border border-border bg-card p-4 sm:p-5">
            <div className="mb-4">
            <ResponsiveHeaderRow
                left={
                <div>
                    <h2 className="text-sm font-medium text-foreground">
                    All teachers
                    </h2>
                    <p className="text-xs text-muted-foreground">
                    Browse and manage your teaching staff.
                    </p>
                </div>
                }
                right={
                <div className="sm:w-64">
                    <LiveSearch placeholder="Search teachers..." />
                </div>
                }
            />
            </div>

            <TeachersTable
            teachers={teachers.map((t) => ({
                id: t.id,
                name: t.name,
                email: t.email,
                subject: t.subject,
            }))}
            />

            {teachers.length === 0 && (
            <p className="mt-4 text-sm text-muted-foreground">
                No teachers match your search.
            </p>
            )}
        </div>
        </main>
    );
}