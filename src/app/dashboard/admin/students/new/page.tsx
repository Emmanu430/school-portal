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
        const className = formData.get("className") as string;
        const email = formData.get("email") as string;

        await prisma.student.create({
        data: { name, className, email },
        });

        redirect("/dashboard/admin/students");
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-background">
        <form
            action={createStudent}
            className="flex w-full max-w-sm flex-col gap-4 rounded-lg border border-border bg-card p-6"
        >
            <h1 className="text-2xl font-bold text-foreground">Add Student</h1>

            <input
            type="text"
            name="name"
            placeholder="Full Name"
            className="rounded border border-border bg-input px-3 py-2 text-foreground placeholder:text-muted-foreground"
            required
            />

            <input
            type="text"
            name="className"
            placeholder="Class (e.g. SS2)"
            className="rounded border border-border bg-input px-3 py-2 text-foreground placeholder:text-muted-foreground"
            required
            />

            <input
            type="email"
            name="email"
            placeholder="Email"
            className="rounded border border-border bg-input px-3 py-2 text-foreground placeholder:text-muted-foreground"
            required
            />

            <button
            type="submit"
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
            Create Student
            </button>
        </form>
        </main>
    );
}