    import { auth } from "@/auth";
    import { redirect } from "next/navigation";
    import Link from "next/link";
    import { ThemeToggle } from "@/components/theme-toggle";
    import LogoutButton from "@/components/LogoutButton";
    import { LayoutDashboard, UserPlus, Users, GraduationCap, ClipboardList } from "lucide-react";

    export default async function DashboardLayout({
    children,
    }: {
    children: React.ReactNode;
    }) {
    const session = await auth();

    if (!session) {
        redirect("/login");
    }

    const role = session.user?.role;

    return (
        <div className="flex min-h-screen bg-background">
        <aside className="w-56 shrink-0 border-r border-border p-4 flex flex-col gap-2">
            <div className="flex items-center justify-between mb-2">
            <p className="text-xs uppercase text-muted-foreground">
                {role} Menu
            </p>
            <ThemeToggle />
            </div>

            <Link href="/dashboard" className="flex items-center gap-2 text-foreground hover:underline">
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
            </Link>

            {role === "ADMIN" && (
            <>
                <Link href="/dashboard/admin/students/new" className="flex items-center gap-2 text-foreground hover:underline">
                <UserPlus className="h-4 w-4" />
                Add Student
                </Link>
                <Link href="/dashboard/admin/students" className="flex items-center gap-2 text-foreground hover:underline">
                <Users className="h-4 w-4" />
                Manage Students
                </Link>
                <Link href="/dashboard/admin/users/new" className="flex items-center gap-2 text-foreground hover:underline">
                <UserPlus className="h-4 w-4" />
                Add Teacher
                </Link>
                <Link href="/dashboard/admin/teachers" className="flex items-center gap-2 text-foreground hover:underline">
                <GraduationCap className="h-4 w-4" />
                Manage Teachers
                </Link>
            </>
            )}

            {role === "TEACHER" && (
            <Link href="/dashboard/teacher/grades" className="flex items-center gap-2 text-foreground hover:underline">
                <ClipboardList className="h-4 w-4" />
                Grades
            </Link>
            )}

            <div className="mt-auto">
            <LogoutButton />
            </div>
        </aside>

        <main className="flex-1">{children}</main>
        </div>
    );
}