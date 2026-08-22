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
    include: { class: true },
  });

  if (!student) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <h1 className="text-2xl font-bold text-destructive">Student not found</h1>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-2 bg-background">
      <h1 className="text-3xl font-bold text-foreground">{student.name}</h1>
      <p className="text-lg text-muted-foreground">Class: {student.class?.name ?? "—"}</p>
      <p className="text-sm text-muted-foreground">{student.email}</p>
    </main>
  );
}