import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function TeacherDashboard() {
  const session = await auth();

  if (!session || session.user?.role !== "TEACHER") {
    redirect("/login");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background">
      <h1 className="text-3xl font-bold text-foreground">Teacher Dashboard</h1>
      <p className="text-muted-foreground">Welcome, {session.user?.name}</p>
    </main>
  );
}