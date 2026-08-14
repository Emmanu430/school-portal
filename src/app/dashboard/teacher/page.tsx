import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function TeacherDashboard() {
  const session = await auth();

  if (!session || session.user?.role !== "TEACHER") {
    redirect("/login");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-white dark:bg-black">
      <h1 className="text-3xl font-bold text-black dark:text-white">Teacher Dashboard</h1>
      <p className="text-zinc-600 dark:text-zinc-400">Welcome, {session.user?.name}</p>
    </main>
  );
}