    import { auth } from "@/auth";
    import { redirect, notFound } from "next/navigation";
    import { prisma } from "@/lib/prisma";
    import EditStudentForm from "@/components/EditStudentForm";

    export default async function EditStudentPage({
    params,
    }: {
    params: Promise<{ id: string }>;
    }) {
    const session = await auth();
    if (!session || session.user?.role !== "ADMIN") {
        redirect("/login");
    }

    const { id } = await params;
    const student = await prisma.student.findUnique({
        where: { id: Number(id) },
    });

    if (!student) {
        notFound();
    }

    const availableUsers = await prisma.user.findMany({
        where: {
        role: "STUDENT",
        OR: [{ student: null }, { student: { id: student.id } }],
        },
    });

    async function updateStudent(formData: FormData) {
        "use server";

        const nameInput = formData.get("name") as string;
        const className = formData.get("className") as string;
        const emailInput = formData.get("email") as string;
        const userIdRaw = formData.get("userId") as string;

        const userId = userIdRaw === "" ? null : Number(userIdRaw);

        let finalName = nameInput;
        let finalEmail = emailInput;

        if (userId) {
        const linkedUser = await prisma.user.findUnique({ where: { id: userId } });
        if (linkedUser) {
            finalName = linkedUser.name;
            finalEmail = linkedUser.email;
        }
        }

        await prisma.student.update({
        where: { id: Number(id) },
        data: { name: finalName, className, email: finalEmail, userId },
        });

        redirect("/dashboard/admin/students");
    }

    async function deleteStudent() {
        "use server";

        await prisma.student.delete({
        where: { id: Number(id) },
        });

        redirect("/dashboard/admin/students");
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-white dark:bg-black">
        <div className="flex w-full max-w-sm flex-col gap-4">
            <EditStudentForm
            student={student}
            availableUsers={availableUsers}
            action={updateStudent}
            />

            <form action={deleteStudent}>
            <button
                type="submit"
                className="w-full rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
            >
                Delete Student
            </button>
            </form>
        </div>
        </main>
    );
}