import { auth } from "@/auth";
import { redirect } from "next/navigation";
import MobileSidebar from "@/components/MobileSidebar";
import { SidebarLink } from "@/components/Sidebarlink";
import { LayoutDashboard, UserPlus, Users, GraduationCap, ClipboardList, Calendar } from "lucide-react";
import { prisma } from "@/lib/prisma";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const role = session.user?.role;
  const userEmail = session.user?.email;

  const userInitials = session.user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const dbUser = await prisma.user.findUnique({
  where: { id: Number(session.user.id) },
  select: { image: true },
});
  return (
    <div className="flex min-h-screen bg-background">
      <MobileSidebar
        userInitials={userInitials}
        userName={session.user?.name ?? undefined}
        userEmail={session.user?.email ?? undefined}
        userImage={dbUser?.image}
      >
        <div className="mb-3 px-3">
          <p className="text-xs uppercase text-muted-foreground tracking-wide">
            {role} Menu
          </p>
        </div>

        <nav className="flex-1 min-h-0 overflow-y-auto flex flex-col gap-2.5">
          <SidebarLink
            href="/dashboard"
            icon={<LayoutDashboard className="h-4 w-4" />}
            label="Dashboard"
          />

          {role === "ADMIN" && (
            <>
              <SidebarLink href="/dashboard/admin/students/assign" icon={<UserPlus className="h-4 w-4" />} label="Assign Class" />
              <SidebarLink href="/dashboard/admin/students/new" icon={<UserPlus className="h-4 w-4" />} label="Add Student" />
              <SidebarLink href="/dashboard/admin/students" icon={<Users className="h-4 w-4" />} label="Manage Students" />
              <SidebarLink href="/dashboard/admin/classes" icon={<ClipboardList className="h-4 w-4" />} label="Manage Classes" />
              <SidebarLink href="/dashboard/admin/users/new" icon={<UserPlus className="h-4 w-4" />} label="Add Teacher" />
              <SidebarLink href="/dashboard/admin/teachers" icon={<GraduationCap className="h-4 w-4" />} label="Manage Teachers" />
              <SidebarLink href="/dashboard/admin/events" icon={<Calendar className="h-4 w-4" />} label="Manage Events" />
            </>
          )}

          {role === "TEACHER" && (
            <>
              <SidebarLink href="/dashboard/teacher/grades" icon={<ClipboardList className="h-4 w-4" />} label="Grades" />
              <SidebarLink href="/dashboard/teacher/attendance" icon={<ClipboardList className="h-4 w-4" />} label="Attendance" />
              <SidebarLink href="/dashboard/teacher/attendance/view" icon={<ClipboardList className="h-4 w-4" />} label="View Attendance" />
            </>
          )}
        </nav>
      </MobileSidebar>

      <main className="flex-1 pt-14">{children}</main>
    </div>
  );
}