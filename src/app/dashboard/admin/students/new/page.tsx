import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

    export default async function NewStudentPage() {
    const session = await auth();

    if (!session || session.user?.role !== "ADMIN") {
        redirect("/login");
    }

    async function createStudent(formData: FormData) {
        "use server";

        const name = formData.get("name") as string;
        const grade = formData.get("grade") as string;
        const email = formData.get("email") as string;

        await prisma.student.create({
        data: { name, grade, email },
        });

        redirect("/dashboard/admin/students");
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-white dark:bg-black">
        <form
            action={createStudent}
            className="flex w-full max-w-sm flex-col gap-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6"
        >
            <h1 className="text-2xl font-bold text-black dark:text-white">Add Student</h1>

            <input
            type="text"
            name="name"
            placeholder="Full Name"
            className="rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-black dark:text-white placeholder:text-zinc-400"
            required
            />

            <input
            type="text"
            name="grade"
            placeholder="Grade (e.g. SS2)"
            className="rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-black dark:text-white placeholder:text-zinc-400"
            required
            />

            <input
            type="email"
            name="email"
            placeholder="Email"
            className="rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-black dark:text-white placeholder:text-zinc-400"
            required
            />

            <button
            type="submit"
            className="rounded bg-black dark:bg-white px-4 py-2 text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200"
            >
            Create Student
            </button>
        </form>
        </main>
    );
}