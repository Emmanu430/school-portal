import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminStudentsPage() {
    const session = await auth();

    if (!session || session.user?.role !== "ADMIN") {
        redirect("/login");
    }

    const students = await prisma.student.findMany({
        orderBy: { createdAt: "desc" },
    });

    return (
        <main className="flex min-h-screen flex-col items-center gap-6 py-16 bg-white dark:bg-black">
        <h1 className="text-3xl font-bold text-black dark:text-white">Manage Students</h1>

        <Link
            href="/dashboard/admin/students/new"
            className="rounded bg-black dark:bg-white px-4 py-2 text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200"
        >
            + Add Student
        </Link>

        <table className="w-full max-w-2xl border-collapse">
            <thead>
            <tr className="border-b border-zinc-200 dark:border-zinc-800 text-left">
                <th className="p-2 text-black dark:text-white">Name</th>
                <th className="p-2 text-black dark:text-white">Grade</th>
                <th className="p-2 text-black dark:text-white">Email</th>
            </tr>
            </thead>
            <tbody>
            {students.map((student) => (
                <tr key={student.id} className="border-b border-zinc-100 dark:border-zinc-900">
                <td className="p-2 text-black dark:text-white">
                    <Link href={`/dashboard/admin/students/${student.id}/edit`} className="underline hover:text-zinc-600 dark:hover:text-zinc-300">{student.name}</Link>
                </td>
                <td className="p-2 text-zinc-600 dark:text-zinc-400">{student.grade}</td>
                <td className="p-2 text-zinc-600 dark:text-zinc-400">{student.email}</td>
                </tr>
            ))}
            </tbody>
        </table>
        </main>
    );
}