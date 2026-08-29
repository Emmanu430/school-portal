import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { GraduationCap, Users, ClipboardList, UserPlus } from "lucide-react";
import { StatCard } from "@/components/Statcard";
import { AttendanceChart } from "@/components/AttendanceChart";
import { QuickActions } from "@/components/QuickActions";
import { RecentActivity } from "@/components/RecentActivity";
import { UpcomingEvents } from "@/components/UpcomingEvents";

function timeAgo(date: Date) {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default async function AdminDashboard() {
  const session = await auth();

  if (!session || session.user?.role !== "ADMIN") {
    redirect("/login");
  }

  const [studentCount, teacherCount, classCount] = await Promise.all([
    prisma.student.count(),
    prisma.teacher.count(),
    prisma.class.count(),
  ]);
  const upcomingEvents = await prisma.event.findMany({
  where: { date: { gte: new Date() } },
  orderBy: { date: "asc" },
  take: 3,
  });

  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 = Sun
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() + mondayOffset);
  startOfWeek.setHours(0, 0, 0, 0);

  const weekAttendanceRecords = await prisma.attendance.findMany({
    where: { date: { gte: startOfWeek } },
    select: { date: true, status: true },
  });

  const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const weeklyAttendance = dayLabels.map((label, i) => {
    const dayDate = new Date(startOfWeek);
    dayDate.setDate(startOfWeek.getDate() + i);

    const recordsForDay = weekAttendanceRecords.filter(
      (r) => r.date.toDateString() === dayDate.toDateString()
    );

    const present = recordsForDay.filter(
      (r) => r.status === "PRESENT" || r.status === "LATE"
    ).length;
    const absent = recordsForDay.filter((r) => r.status === "ABSENT").length;

    return { day: label, present, absent };
  });

  const [recentStudents, recentTeachers] = await Promise.all([
    prisma.student.findMany({ orderBy: { createdAt: "desc" }, take: 3 }),
    prisma.teacher.findMany({ orderBy: { createdAt: "desc" }, take: 3 }),
  ]);

  const combinedActivity = [
    ...recentStudents.map((s) => ({
      name: s.name,
      createdAt: s.createdAt,
      kind: "student" as const,
    })),
    ...recentTeachers.map((t) => ({
      name: t.name,
      createdAt: t.createdAt,
      kind: "teacher" as const,
    })),
  ]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 4);

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
        <StatCard icon={GraduationCap} label="Total students" value={studentCount.toLocaleString()} menuHref="/dashboard/admin/students" />
        <StatCard icon={Users} label="Teaching staff" value={teacherCount.toLocaleString()} menuHref="/dashboard/admin/teachers" />
        <StatCard icon={ClipboardList} label="Classes" value={classCount.toLocaleString()} menuHref="/dashboard/admin/classes" />
      </div>

      <div className="mt-4">
        <AttendanceChart data={weeklyAttendance} subtitle="Present vs. absent this week" />
      </div>

      <div className="mt-4">
        <QuickActions
          actions={[
            { href: "/dashboard/admin/students/new", icon: <UserPlus className="h-4 w-4" />, label: "Add student", tint: "primary" },
            { href: "/dashboard/admin/teachers", icon: <Users className="h-4 w-4" />, label: "Manage teachers", tint: "accent" },
            { href: "/dashboard/admin/classes", icon: <ClipboardList className="h-4 w-4" />, label: "Manage classes", tint: "chart3" },
            { href: "/dashboard/admin/users/new", icon: <GraduationCap className="h-4 w-4" />, label: "Add teacher", tint: "secondary" },
          ]}
        />
      </div>
          <div className="mt-4">
            <UpcomingEvents events={upcomingEvents} />
        </div>
      <div className="mt-4">
        <RecentActivity
          items={combinedActivity.map((item) => ({
            icon: item.kind === "student" ? <GraduationCap className="h-4 w-4" /> : <Users className="h-4 w-4" />,
            title: item.kind === "student" ? `${item.name} was added` : `${item.name} joined as a teacher`,
            meta: `${item.kind === "student" ? "New student" : "New teacher"} · ${timeAgo(item.createdAt)}`,
            tint: item.kind === "student" ? "primary" : "accent",
          }))}
        />
      </div>
    </main>
  );
}