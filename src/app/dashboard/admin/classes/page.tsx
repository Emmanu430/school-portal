    import { auth } from "@/auth";
    import { redirect } from "next/navigation";
    import { prisma } from "@/lib/prisma";
    import { Building2, AlertCircle } from "lucide-react";
    import { StatCard } from "@/components/Statcard";
    import { revalidatePath } from "next/cache";

    export default async function AdminClassesPage() {
    const session = await auth();

    if (!session || session.user?.role !== "ADMIN") {
        redirect("/login");
    }

    const classes = await prisma.class.findMany({
        orderBy: { name: "asc" },
        include: {
        _count: {
            select: { students: true },
        },
        },
    });

    const totalClasses = classes.length;
    const emptyClasses = classes.filter((c) => c._count.students === 0).length;

    async function addClass(formData: FormData) {
        "use server";
        const name = formData.get("name") as string;
        if (!name?.trim()) return;
        try {
            await prisma.class.create({ data: { name: name.trim() } });
            revalidatePath("/dashboard/admin/classes");
        } catch (err: any) {
            if (err.code === "P2002") {
            return;
            }
            throw err;
        }
        }

    async function deleteClass(formData: FormData) {
        "use server";
        const id = Number(formData.get("id"));
        await prisma.class.delete({ where: { id } });
        revalidatePath("/dashboard/admin/classes");
    }

    return (
        <main className="min-h-screen bg-background p-5 sm:p-8">
        <p className="text-xs text-primary font-medium">School directory</p>
        <h1 className="mt-1 text-2xl sm:text-3xl font-medium text-foreground">
            Classes
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
            Manage class groups and enrollment.
        </p>

        <div className="mt-6 grid grid-cols-2 gap-4 max-w-xl">
            <StatCard
            icon={Building2}
            label="Total classes"
            value={totalClasses.toLocaleString()}
            />
            <StatCard
            icon={AlertCircle}
            label="Empty classes"
            value={emptyClasses.toLocaleString()}
            />
        </div>

        <div className="mt-6 max-w-xl rounded-2xl border border-border bg-card p-4 sm:p-5">
            <form action={addClass} className="flex gap-2 mb-4">
            <input
                type="text"
                name="name"
                placeholder="Class name (e.g. SS1)"
                className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground"
            />
            <button
                type="submit"
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
                Add
            </button>
            </form>

            <div className="flex flex-col gap-2">
            {classes.map((cls) => (
                <div
                key={cls.id}
                className="flex items-center justify-between rounded-lg border border-border px-3 py-2.5"
                >
                <div className="flex items-center gap-2.5">
                    <span className="text-sm font-medium text-foreground">
                    {cls.name}
                    </span>
                    <span className="text-xs text-muted-foreground bg-muted rounded-full px-2 py-0.5">
                    {cls._count.students}{" "}
                    {cls._count.students === 1 ? "student" : "students"}
                    </span>
                </div>
                <form action={deleteClass}>
                    <input type="hidden" name="id" value={cls.id} />
                    <button
                    type="submit"
                    className="text-xs text-destructive hover:underline"
                    >
                    Delete
                    </button>
                </form>
                </div>
            ))}
            </div>

            {classes.length === 0 && (
            <p className="text-sm text-muted-foreground">
                No classes yet — add one above.
            </p>
            )}
        </div>
        </main>
    );
}