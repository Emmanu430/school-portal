import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function StudentProfile({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();

  if (!session || (session.user?.role !== "ADMIN" && session.user?.role !== "TEACHER")) {
    redirect("/login");
  }

  const { id } = await params;

  const student = await prisma.student.findUnique({
    where: { id: Number(id) },
  });

  if (!student) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white dark:bg-black">
        <h1 className="text-2xl font-bold text-red-600">Student not found</h1>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-2 bg-white dark:bg-black">
      <h1 className="text-3xl font-bold text-black dark:text-white">{student.name}</h1>
      <p className="text-lg text-zinc-600 dark:text-zinc-400">Grade: {student.grade}</p>
      <p className="text-sm text-zinc-400 dark:text-zinc-500">{student.email}</p>
    </main>
  );
}