    import { auth } from "@/auth";
    import { redirect } from "next/navigation";
    import { prisma } from "@/lib/prisma";
    import ClassSelect from "@/components/ClassSelect";
    import FormSelect from "@/components/FormSelect";

    export default async function AssignClassPage({
    searchParams,
    }: {
    searchParams: Promise<{ success?: string; error?: string }>;
    }) {
    const session = await auth();

    if (!session || session.user?.role !== "ADMIN") {
        redirect("/login");
    }

    const { success, error } = await searchParams;

    const unassignedUsers = await prisma.user.findMany({
        where: {
        role: "STUDENT",
        student: null,
        },
    });

    const classes = await prisma.class.findMany({ orderBy: { name: "asc" } });

    async function assignClass(formData: FormData) {
        "use server";

        const userId = Number(formData.get("userId"));
        const classIdRaw = formData.get("classId") as string;
        const classId = classIdRaw ? Number(classIdRaw) : null;

        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) return;

        const existingStudent = await prisma.student.findUnique({
        where: { email: user.email },
        });
        if (existingStudent) {
        redirect("/dashboard/admin/students/assign?error=exists");
        }

        await prisma.student.create({
        data: {
            name: user.name,
            email: user.email,
            classId,
            userId: user.id,
        },
        });

        redirect("/dashboard/admin/students/assign?success=1");
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-background">
        <form
            action={assignClass}
            className="flex w-full max-w-sm flex-col gap-4 rounded-lg border border-border bg-card p-6"
        >
            <h1 className="text-2xl font-bold text-foreground">Assign Class</h1>

            {success === "1" && (
            <p className="text-sm text-primary">
                Student assigned successfully.
            </p>
            )}

            {error === "exists" && (
            <p className="text-sm text-destructive">
                A student record with this email already exists — edit it directly instead.
            </p>
            )}

            {unassignedUsers.length === 0 ? (
            <p className="text-sm text-muted-foreground">
                No registered students are waiting for a class assignment.
            </p>
            ) : (
            <>
                <FormSelect
                name="userId"
                placeholder="Select a student"
                options={unassignedUsers.map((u) => ({
                    value: String(u.id),
                    label: `${u.name} (${u.email})`,
                }))}
                />

                <ClassSelect classes={classes} />

                <button
                type="submit"
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                Assign
                </button>
            </>
            )}
        </form>
        </main>
    );
}
