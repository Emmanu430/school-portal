    import { auth } from "@/auth";
    import { redirect } from "next/navigation";
    import Link from "next/link";
    import { ThemeToggle } from "@/components/theme-toggle";
    import LogoutButton from "@/components/LogoutButton";

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

            <Link href="/dashboard" className="text-foreground hover:underline">
            Dashboard
            </Link>

            {role === "ADMIN" && (
            <Link href="/dashboard/admin/students" className="text-foreground hover:underline">
                Manage Students
            </Link>
            )}

            {role === "ADMIN" && (
            <Link href="/dashboard/admin/teachers" className="text-foreground hover:underline">
                Manage Teachers
            </Link>
            )}
            {role === "ADMIN" && (
                <Link href="/dashboard/admin/users/new" className="text-foreground hover:underline">
                    Create Staff Account
                </Link>
                )}

            {role === "TEACHER" && (
            <Link href="/dashboard/teacher/grades" className="text-foreground hover:underline">
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