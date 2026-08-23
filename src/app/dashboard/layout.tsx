import { auth } from "@/auth";
import { redirect } from "next/navigation";

import LogoutButton from "@/components/LogoutButton";
import MobileSidebar from "@/components/MobileSidebar";
import { SidebarLink } from "@/components/Sidebarlink";
import { LayoutDashboard, UserPlus, Users, GraduationCap, ClipboardList } from "lucide-react";

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

  const userInitials = session.user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex min-h-screen bg-background">
      <MobileSidebar userInitials={userInitials}>
        <div className="flex items-center justify-between mb-2 px-3">
          <p className="text-xs uppercase text-muted-foreground tracking-wide">
            {role} Menu
          </p>
        </div>

        <SidebarLink
          href="/dashboard"
          icon={<LayoutDashboard className="h-4 w-4" />}
          label="Dashboard"
        />

        {role === "ADMIN" && (
          <>
            <SidebarLink
              href="/dashboard/admin/students/assign"
              icon={<UserPlus className="h-4 w-4" />}
              label="Assign Class"
            />
            <SidebarLink
              href="/dashboard/admin/students/new"
              icon={<UserPlus className="h-4 w-4" />}
              label="Add Student"
            />
            <SidebarLink
              href="/dashboard/admin/students"
              icon={<Users className="h-4 w-4" />}
              label="Manage Students"
            />
            <SidebarLink
              href="/dashboard/admin/classes"
              icon={<ClipboardList className="h-4 w-4" />}
              label="Manage Classes"
            />
            <SidebarLink
              href="/dashboard/admin/users/new"
              icon={<UserPlus className="h-4 w-4" />}
              label="Add Teacher"
            />
            <SidebarLink
              href="/dashboard/admin/teachers"
              icon={<GraduationCap className="h-4 w-4" />}
              label="Manage Teachers"
            />
          </>
        )}

        {role === "TEACHER" && (
          <>
            <SidebarLink
              href="/dashboard/teacher/grades"
              icon={<ClipboardList className="h-4 w-4" />}
              label="Grades"
            />
            <SidebarLink
              href="/dashboard/teacher/attendance"
              icon={<ClipboardList className="h-4 w-4" />}
              label="Attendance"
            />
            <SidebarLink
              href="/dashboard/teacher/attendance/view"
              icon={<ClipboardList className="h-4 w-4" />}
              label="View Attendance"
            />
          </>
        )}

        <div className="mt-auto px-3">
          <LogoutButton />
        </div>
      </MobileSidebar>

      <main className="flex-1 pt-14">{children}</main>
    </div>
  );
}