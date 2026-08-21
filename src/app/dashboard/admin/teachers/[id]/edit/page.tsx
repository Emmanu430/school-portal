    import { auth } from "@/auth";
    import { redirect, notFound } from "next/navigation";
    import { prisma } from "@/lib/prisma";
    import bcrypt from "bcryptjs";
    import EditTeacherForm from "@/components/EditTeacherForm";

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

    const availableUsers = await prisma.user.findMany({
        where: {
        role: "TEACHER",
        OR: [{ teacher: null }, { teacher: { id: teacher.id } }],
        },
    });

    const classes = await prisma.class.findMany({ orderBy: { name: "asc" } });

    async function updateTeacher(formData: FormData) {
        "use server";

        const nameInput = formData.get("name") as string;
        const subject = formData.get("subject") as string;
        const emailInput = formData.get("email") as string;
        const userIdRaw = formData.get("userId") as string;
        const newPassword = formData.get("newPassword") as string;
        const classIdRaw = formData.get("classId") as string;

        const userId = userIdRaw === "" ? null : Number(userIdRaw);
        const classId = classIdRaw ? Number(classIdRaw) : null;

        let finalName = nameInput;
        let finalEmail = emailInput;

        if (userId) {
        const linkedUser = await prisma.user.findUnique({ where: { id: userId } });
        if (linkedUser) {
            finalName = linkedUser.name;
            finalEmail = linkedUser.email;
        }

        if (newPassword && newPassword.length >= 6) {
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            await prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword },
            });
        }
        }

        let assignedClass = "";
        if (classId) {
        const cls = await prisma.class.findUnique({ where: { id: classId } });
        assignedClass = cls?.name ?? "";
        }

        await prisma.teacher.update({
        where: { id: Number(id) },
        data: {
            name: finalName,
            subject,
            email: finalEmail,
            assignedClass: assignedClass === "" ? null : assignedClass,
            classId,
            userId,
        },
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
            <EditTeacherForm
            teacher={teacher}
            availableUsers={availableUsers}
            classes={classes}
            action={updateTeacher}
            />

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