    import { auth } from "@/auth";
    import { redirect } from "next/navigation";
    import bcrypt from "bcryptjs";
    import { prisma } from "@/lib/prisma";
    import CreateUserForm from "@/components/CreateUserForm";
    import Link from "next/link";

    export default async function NewUserPage({
    searchParams,
    }: {
    searchParams: Promise<{ success?: string }>;
    }) {
    const session = await auth();

    if (!session || session.user?.role !== "ADMIN") {
        redirect("/login");
    }

    const { success } = await searchParams;

    async function createUser(formData: FormData) {
        "use server";

        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const role = formData.get("role") as string;

        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
        redirect("/dashboard/admin/users/new?error=exists");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.user.create({
        data: { name, email, password: hashedPassword, role: role as "ADMIN" | "TEACHER" | "STUDENT" },
        });

        redirect("/dashboard/admin/users/new?success=1");
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex w-full max-w-sm flex-col gap-4">
            {success && (
            <p className="text-sm text-center text-primary">
                Account created. Now link it to a teacher record from{" "} 
                <Link href="/dashboard/admin/teachers" className="text-primary underline">
                    Manage Teachers
                </Link>
                .
            </p>
            )}
            <CreateUserForm action={createUser} />
        </div>
        </main>
    );
}