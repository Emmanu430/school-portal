import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { GraduationCap, Users, ClipboardList } from "lucide-react";
import { StatCard } from "@/components/Statcard";

export default async function AdminDashboard() {
  const session = await auth();

  if (!session || session.user?.role !== "ADMIN") {
    redirect("/login");
  }

  const [studentCount, teacherCount, classCount] =
    await Promise.all([
      prisma.student.count(),
      prisma.teacher.count(),
      prisma.class.count(),
    ]);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <main className="min-h-screen bg-background p-5 sm:p-8">
      <p className="text-xs text-primary font-medium">{today}</p>
      <h1 className="mt-1 text-2xl sm:text-3xl font-medium text-foreground">
        {greeting}, {session.user?.name?.split(" ")[0] ?? "Admin"}
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Here's what's happening at your school today.
      </p>

      <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
        <StatCard
          icon={GraduationCap}
          label="Total students"
          value={studentCount.toLocaleString()}
        />
        <StatCard
          icon={Users}
          label="Teaching staff"
          value={teacherCount.toLocaleString()}
        />
        <StatCard
          icon={ClipboardList}
          label="Classes"
          value={classCount.toLocaleString()}
        />
      </div>
    </main>
  );
}