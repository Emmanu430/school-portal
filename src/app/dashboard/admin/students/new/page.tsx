    import { auth } from "@/auth";
    import { redirect } from "next/navigation";
    import bcrypt from "bcryptjs";
    import { prisma } from "@/lib/prisma";
    import CreateStudentForm from "@/components/CreateStudentForm";

    export default async function NewStudentPage({
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

    async function createStudent(formData: FormData) {
        "use server";

        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const classIdRaw = formData.get("classId") as string;
        const classId = classIdRaw ? Number(classIdRaw) : null;

        const existingUser = await prisma.user.findUnique({ where: { email } });
        const existingStudent = await prisma.student.findUnique({ where: { email } });
        if (existingUser || existingStudent) {
        redirect("/dashboard/admin/students/new?error=exists");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
        data: { name, email, password: hashedPassword, role: "STUDENT" },
        });

        await prisma.student.create({
        data: {
            name,
            email,
            classId,
            userId: newUser.id,
        },
        });

        redirect("/dashboard/admin/students/new?success=1");
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-background">
        <CreateStudentForm classes={classes} action={createStudent} error={error} success={success} />
        </main>
    );
}