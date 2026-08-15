import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function StudentsList() {
    const students = await prisma.student.findMany();

    return (
        <main className="flex min-h-screen flex-col items-center gap-4 py-16">
        <h1 className="text-3xl font-bold">All Students</h1>
        <ul className="flex flex-col gap-2">
            {students.map((student) => (
            <li key={student.id}>
                <Link
                href={`/students/${student.id}`}
                className="text-blue-600 underline hover:text-blue-800"
                >
                {student.name} — {student.className}
                </Link>
            </li>
            ))}
        </ul>
        </main>
    );
}