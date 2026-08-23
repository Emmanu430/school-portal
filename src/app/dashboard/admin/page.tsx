import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { GraduationCap, Users, ClipboardList, UserPlus } from "lucide-react";
import { StatCard } from "@/components/Statcard";
import {AttendanceChart} from "@/components/AttendanceChart";
import { QuickActions } from "@/components/QuickActions";
import { RecentActivity } from "@/components/RecentActivity";


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

    const recentStudents = await prisma.student.findMany({
  orderBy: { createdAt: "desc" },
  take: 3,
});

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

    const weeklyAttendance = [
  { day: "Mon", present: 280, absent: 20 },
  { day: "Tue", present: 265, absent: 35 },
  { day: "Wed", present: 290, absent: 10 },
  { day: "Thu", present: 275, absent: 25 },
  { day: "Fri", present: 260, absent: 40 },
  ];

  

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
      <div className="mt-4">
        <AttendanceChart data={weeklyAttendance} subtitle="Present vs. absent this week" />
    </div>
    <div className="mt-4">
  <QuickActions
    actions={[
      {
        href: "/dashboard/admin/students/new",
        icon: <UserPlus className="h-4 w-4" />,
        label: "Add student",
        tint: "primary",
      },
      {
        href: "/dashboard/admin/teachers",
        icon: <Users className="h-4 w-4" />,
        label: "Manage teachers",
        tint: "accent",
      },
      {
        href: "/dashboard/admin/classes",
        icon: <ClipboardList className="h-4 w-4" />,
        label: "Manage classes",
        tint: "chart3",
      },
      {
        href: "/dashboard/admin/users/new",
        icon: <GraduationCap className="h-4 w-4" />,
        label: "Add teacher",
        tint: "secondary",
      },
    ]}
  />
</div>
    <div className="mt-4">
  <RecentActivity
    items={recentStudents.map((s) => ({
      icon: <GraduationCap className="h-4 w-4" />,
      title: `${s.name} was added`,
      meta: "New student",
      tint: "primary",
    }))}
  />
</div>
    </main>
  );
}