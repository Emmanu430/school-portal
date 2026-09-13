import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Users, BookOpen, ClipboardList, ClipboardCheck } from "lucide-react";
import { StatCard } from "@/components/Statcard";
import { QuickActions } from "@/components/QuickActions";

export default async function TeacherDashboard() {
  const session = await auth();

  if (!session || session.user?.role !== "TEACHER") {
    redirect("/login");
  }

  const teacher = await prisma.teacher.findUnique({
    where: { userId: Number(session.user.id) },
    include: {
      class: {
        include: { students: true },
      },
    },
  });

  const studentCount = teacher?.class?.students.length ?? 0;

  const gradesEnteredCount = teacher
    ? await prisma.grade.count({ where: { teacherId: teacher.id } })
    : 0;

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
        {greeting}, {session.user?.name?.split(" ")[0] ?? "Teacher"}
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {teacher
          ? `Teaching ${teacher.subject}${teacher.class ? ` · ${teacher.class.name}` : ""}`
          : "No class assignment yet."}
      </p>

      <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
        <StatCard icon={Users} label="Your students" value={studentCount.toLocaleString()} />
        <StatCard icon={BookOpen} label="Subject" value={teacher?.subject ?? "—"} />
        <StatCard icon={ClipboardCheck} label="Grades entered" value={gradesEnteredCount.toLocaleString()} />
      </div>

      <div className="mt-4">
        <QuickActions
          actions={[
            { href: "/dashboard/teacher/grades", icon: <ClipboardList className="h-4 w-4" />, label: "Enter grades", tint: "primary" },
            { href: "/dashboard/teacher/attendance", icon: <ClipboardCheck className="h-4 w-4" />, label: "Mark attendance", tint: "accent" },
            { href: "/dashboard/teacher/attendance/view", icon: <ClipboardList className="h-4 w-4" />, label: "View attendance", tint: "chart3" },
          ]}
        />
      </div>
    </main>
  );
}