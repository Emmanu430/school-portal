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
        where: { role: "STUDENT", student: null },
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
        data: { name: user.name, email: user.email, classId, userId: user.id },
        });

        redirect("/dashboard/admin/students/assign?success=1");
    }

    return (
        <main className="min-h-screen bg-background p-5 sm:p-8 flex items-center justify-center">
        <form
            action={assignClass}
            className="flex w-full max-w-sm flex-col gap-4 rounded-2xl border border-border bg-card p-6"
        >
            <div>
            <p className="text-xs text-primary font-medium">School directory</p>
            <h1 className="mt-1 text-xl font-medium text-foreground">Assign class</h1>
            </div>

            {success === "1" && (
            <p className="text-xs text-emerald-600">Student assigned successfully.</p>
            )}

            {error === "exists" && (
            <p className="text-xs text-destructive">
                A student record with this email already exists — edit it directly instead.
            </p>
            )}

            {unassignedUsers.length === 0 ? (
            <p className="text-sm text-muted-foreground">
                No registered students are waiting for a class assignment.
            </p>
            ) : (
            <>
                <div>
                <label className="text-xs text-muted-foreground">Student</label>
                <div className="mt-1">
                    <FormSelect
                    name="userId"
                    placeholder="Select a student"
                    options={unassignedUsers.map((u) => ({
                        value: String(u.id),
                        label: `${u.name} (${u.email})`,
                    }))}
                    />
                </div>
                </div>

                <div>
                <label className="text-xs text-muted-foreground">Class</label>
                <div className="mt-1">
                    <ClassSelect classes={classes} />
                </div>
                </div>

                <button
                type="submit"
                className="rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                Assign
                </button>
            </>
            )}
        </form>
        </main>
    );
}