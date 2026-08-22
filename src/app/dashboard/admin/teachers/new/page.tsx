    import { auth } from "@/auth";
    import { redirect } from "next/navigation";
    import { prisma } from "@/lib/prisma";
    import Link from "next/link";
    import ClassSelect from "@/components/ClassSelect";

    export default async function NewTeacherPage({
    searchParams,
    }: {
    searchParams: Promise<{ error?: string; success?: string }>;
    }) {
    const session = await auth();

    if (!session || session.user?.role !== "ADMIN") {
        redirect("/login");
    }

    const { error, success } = await searchParams;
    const classes = await prisma.class.findMany({ orderBy: { name: "asc" } });

    async function createTeacher(formData: FormData) {
        "use server";

        const name = formData.get("name") as string;
        const subject = formData.get("subject") as string;
        const email = formData.get("email") as string;
        const classIdRaw = formData.get("classId") as string;
        const classId = classIdRaw ? Number(classIdRaw) : null;

        const existing = await prisma.teacher.findUnique({ where: { email } });
        if (existing) {
        redirect("/dashboard/admin/teachers/new?error=exists");
        }

        await prisma.teacher.create({
        data: {
            name,
            subject,
            email,
            classId,
        },
        });

        redirect("/dashboard/admin/teachers/new?success=1");
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-background">
        <form
            action={createTeacher}
            className="flex w-full max-w-sm flex-col gap-4 rounded-lg border border-border bg-card p-6"
        >
            <h1 className="text-2xl font-bold text-foreground">Add Teacher</h1>

            {error === "exists" && (
            <p className="text-sm text-destructive">
                A teacher with that email already exists.
            </p>
            )}

            {success === "1" && (
            <p className="text-sm text-primary">
                Teacher created successfully. Add another below, or{" "}
                <Link href="/dashboard/admin/teachers" className="underline">
                view the list
                </Link>.
            </p>
            )}

            <input
            type="text"
            name="name"
            placeholder="Full Name"
            className="rounded border border-border bg-input px-3 py-2 text-foreground placeholder:text-muted-foreground"
            required
            />

            <input
            type="text"
            name="subject"
            placeholder="Subject (e.g. Mathematics)"
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

            <ClassSelect classes={classes} />

            <button
            type="submit"
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
            Create Teacher
            </button>
        </form>
        </main>
    );
}