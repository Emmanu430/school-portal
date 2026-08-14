import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

    export default async function EditStudentPage({
    params,
    }: {
    params: Promise<{ id: string }>;
    }) {
    const session = await auth();
    if (!session || session.user?.role !== "ADMIN") {
        redirect("/login");
    }

    const { id } = await params;
    const student = await prisma.student.findUnique({
        where: { id: Number(id) },
    });

    if (!student) {
        notFound();
    }

    async function updateStudent(formData: FormData) {
        "use server";

        const name = formData.get("name") as string;
        const grade = formData.get("grade") as string;
        const email = formData.get("email") as string;

        await prisma.student.update({
        where: { id: Number(id) },
        data: { name, grade, email },
        });

        redirect("/dashboard/admin/students");
    }

    async function deleteStudent() {
        "use server";

        await prisma.student.delete({
        where: { id: Number(id) },
        });

        redirect("/dashboard/admin/students");
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-white dark:bg-black">
        <div className="flex w-full max-w-sm flex-col gap-4">
            <form
            action={updateStudent}
            className="flex flex-col gap-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6"
            >
            <h1 className="text-2xl font-bold text-black dark:text-white">Edit Student</h1>

            <input
                type="text"
                name="name"
                defaultValue={student.name}
                className="rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-black dark:text-white"
                required
            />

            <input
                type="text"
                name="grade"
                defaultValue={student.grade}
                className="rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-black dark:text-white"
                required
            />

            <input
                type="email"
                name="email"
                defaultValue={student.email}
                className="rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-black dark:text-white"
                required
            />

            <button
                type="submit"
                className="rounded bg-black dark:bg-white px-4 py-2 text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200"
            >
                Save Changes
            </button>
            </form>

            <form action={deleteStudent}>
            <button
                type="submit"
                className="w-full rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
            >
                Delete Student
            </button>
            </form>
        </div>
        </main>
    );
}