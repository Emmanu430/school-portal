    import { auth } from "@/auth";
    import { redirect, notFound } from "next/navigation";
    import { prisma } from "@/lib/prisma";

    export default async function EditTeacherPage({
    params,
    }: {
    params: Promise<{ id: string }>;
    }) {
    const session = await auth();
    if (!session || session.user?.role !== "ADMIN") {
        redirect("/login");
    }

    const { id } = await params;
    const teacher = await prisma.teacher.findUnique({
        where: { id: Number(id) },
    });

    if (!teacher) {
        notFound();
    }

    async function updateTeacher(formData: FormData) {
        "use server";

        const name = formData.get("name") as string;
        const subject = formData.get("subject") as string;
        const email = formData.get("email") as string;

        await prisma.teacher.update({
        where: { id: Number(id) },
        data: { name, subject, email },
        });

        redirect("/dashboard/admin/teachers");
    }

    async function deleteTeacher() {
        "use server";

        await prisma.teacher.delete({
        where: { id: Number(id) },
        });

        redirect("/dashboard/admin/teachers");
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex w-full max-w-sm flex-col gap-4">
            <form
            action={updateTeacher}
            className="flex flex-col gap-4 rounded-lg border border-border bg-card p-6"
            >
            <h1 className="text-2xl font-bold text-foreground">Edit Teacher</h1>

            <input
                type="text"
                name="name"
                defaultValue={teacher.name}
                className="rounded border border-border bg-input px-3 py-2 text-foreground"
                required
            />

            <input
                type="text"
                name="subject"
                defaultValue={teacher.subject}
                className="rounded border border-border bg-input px-3 py-2 text-foreground"
                required
            />

            <input
                type="email"
                name="email"
                defaultValue={teacher.email}
                className="rounded border border-border bg-input px-3 py-2 text-foreground"
                required
            />

            <button
                type="submit"
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
                Save Changes
            </button>
            </form>

            <form action={deleteTeacher}>
            <button
                type="submit"
                className="w-full rounded-md bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground hover:bg-destructive/90"
            >
                Delete Teacher
            </button>
            </form>
        </div>
        </main>
    );
}