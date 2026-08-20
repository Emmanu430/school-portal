    import { auth } from "@/auth";
    import { redirect } from "next/navigation";
    import { prisma } from "@/lib/prisma";

    export default async function ManageClassesPage({
    searchParams,
    }: {
    searchParams: Promise<{ error?: string }>;
    }) {
    const session = await auth();

    if (!session || session.user?.role !== "ADMIN") {
        redirect("/login");
    }

    const { error } = await searchParams;

    const classes = await prisma.class.findMany({ orderBy: { name: "asc" } });

    async function createClass(formData: FormData) {
        "use server";

        const name = formData.get("name") as string;

        const existing = await prisma.class.findUnique({ where: { name } });
        if (existing) {
        redirect("/dashboard/admin/classes?error=exists");
        }

        await prisma.class.create({ data: { name } });

        redirect("/dashboard/admin/classes");
    }

    async function deleteClass(formData: FormData) {
        "use server";

        const id = Number(formData.get("id"));

        await prisma.class.delete({ where: { id } });

        redirect("/dashboard/admin/classes");
    }

    return (
        <main className="flex min-h-screen flex-col items-center gap-6 py-16 bg-background">
        <h1 className="text-3xl font-bold text-foreground">Manage Classes</h1>

        <form
            action={createClass}
            className="flex w-full max-w-sm gap-2"
        >
            {error === "exists" && (
            <p className="text-sm text-destructive w-full">
                That class already exists.
            </p>
            )}
            <input
            type="text"
            name="name"
            placeholder="Class name (e.g. SS1)"
            className="flex-1 rounded border border-border bg-input px-3 py-2 text-foreground placeholder:text-muted-foreground"
            required
            />
            <button
            type="submit"
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
            Add
            </button>
        </form>

        <ul className="w-full max-w-sm flex flex-col gap-2">
            {classes.map((c) => (
            <li
                key={c.id}
                className="flex items-center justify-between rounded border border-border bg-card px-3 py-2"
            >
                <span className="text-foreground">{c.name}</span>
                <form action={deleteClass}>
                <input type="hidden" name="id" value={c.id} />
                <button
                    type="submit"
                    className="text-sm text-destructive hover:underline"
                >
                    Delete
                </button>
                </form>
            </li>
            ))}
        </ul>
        </main>
    );
}