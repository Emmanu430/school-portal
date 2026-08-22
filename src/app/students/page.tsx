    import { auth } from "@/auth";
    import { redirect } from "next/navigation";
    import Link from "next/link";
    import { prisma } from "@/lib/prisma";

    export default async function StudentsList() {
    const session = await auth();

    if (!session || (session.user?.role !== "ADMIN" && session.user?.role !== "TEACHER")) {
        redirect("/login");
    }

    const students = await prisma.student.findMany({
        include: { class: true },
    });

    return (
        <main className="flex min-h-screen flex-col items-center gap-4 py-16 bg-background">
        <h1 className="text-3xl font-bold text-foreground">All Students</h1>
        <ul className="flex flex-col gap-2">
            {students.map((student) => (
            <li key={student.id}>
                <Link
                href={`/students/${student.id}`}
                className="text-primary underline hover:text-primary/80"
                >
                {student.name} — {student.class?.name ?? "—"}
                </Link>
            </li>
            ))}
        </ul>
        </main>
    );
}