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
        <div className="flex min-h-screen bg-white dark:bg-black">
            <aside className="w-56 shrink-0 border-r border-zinc-200 dark:border-zinc-800 p-4 flex flex-col gap-2">
        <div className="flex items-center justify-between mb-2">
            <p className="text-xs uppercase text-zinc-400">
            {role} Menu
            </p>
            <ThemeToggle />
        </div>

        <Link href="/dashboard" className="text-black dark:text-white hover:underline">
            Dashboard
        </Link>

        {role === "ADMIN" && (
            <Link href="/dashboard/admin/students" className="text-black dark:text-white hover:underline">
            Manage Students
            </Link>
        )}

        {role === "STUDENT" && (
            <Link href="/students" className="text-black dark:text-white hover:underline">
            All Students
            </Link>
        )}
        {role === "ADMIN" && (
            <Link href="/dashboard/admin/teachers" className="text-black dark:text-white hover:underline">
                Manage Teachers
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