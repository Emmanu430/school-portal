    import { auth } from "@/auth";
    import { redirect } from "next/navigation";
    import { prisma } from "@/lib/prisma";
    import ClassSelect from "@/components/ClassSelect";

    export default async function AssignClassPage({
    searchParams,
    }: {
    searchParams: Promise<{ success?: string }>;
    }) {
    const session = await auth();

    if (!session || session.user?.role !== "ADMIN") {
        redirect("/login");
    }

    const { success } = await searchParams;

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

        let className = "";
        if (classId) {
        const cls = await prisma.class.findUnique({ where: { id: classId } });
        className = cls?.name ?? "";
        }

        await prisma.student.create({
        data: {
            name: user.name,
            email: user.email,
            className,
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

            {unassignedUsers.length === 0 ? (
            <p className="text-sm text-muted-foreground">
                No registered students are waiting for a class assignment.
            </p>
            ) : (
            <>
                <select
                name="userId"
                defaultValue=""
                className="rounded border border-border bg-input px-3 py-2 text-foreground [color-scheme:light] dark:[color-scheme:dark]"
                required
                >
                <option value="" disabled>Select a student</option>
                {unassignedUsers.map((u) => (
                    <option key={u.id} value={u.id}>
                    {u.name} ({u.email})
                    </option>
                ))}
                </select>

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