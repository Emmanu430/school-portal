import { prisma } from "@/lib/prisma";

export default async function StudentProfile({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const student = await prisma.student.findUnique({
    where: { id: Number(id) },
  });

  if (!student) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <h1 className="text-2xl font-bold text-red-600">Student not found</h1>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-2">
      <h1 className="text-3xl font-bold">{student.name}</h1>
      <p className="text-lg text-zinc-600">Grade: {student.grade}</p>
      <p className="text-sm text-zinc-400">{student.email}</p>
    </main>
  );
}