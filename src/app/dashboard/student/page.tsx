import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function StudentDashboard() {
    const session = await auth();

    if (!session || (session.user?.role !== "ADMIN" && session.user?.role !== "TEACHER")) {
        redirect("/login");
    }

    const student = await prisma.student.findUnique({
        where: { userId: Number(session.user.id) },
    });

    return (
        <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-white dark:bg-black">
        <h1 className="text-3xl font-bold text-black dark:text-white">Student Dashboard</h1>
        <p className="text-zinc-600 dark:text-zinc-400">Welcome, {session.user?.name}</p>

        {student ? (
            <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-4 text-center">
            <p className="text-black dark:text-white">Grade: {student.grade}</p>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm">{student.email}</p>
            </div>
        ) : (
            <p className="text-sm text-red-600 dark:text-red-400">
            No student record linked to your account yet.
            </p>
        )}

        </main>
    );
}