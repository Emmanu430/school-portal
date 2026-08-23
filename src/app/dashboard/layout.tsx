import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import LogoutButton from "@/components/LogoutButton";
import MobileSidebar from "@/components/MobileSidebar";
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

  return (
    <div className="flex min-h-screen bg-background">
      <MobileSidebar>
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs uppercase text-muted-foreground">
            {role} Menu
          </p>
          <ThemeToggle />
        </div>

        <Link href="/dashboard" className="flex items-center gap-2 text-foreground hover:underline">
          <LayoutDashboard className="h-4 w-4" />
          Dashboard
        </Link>

        {role === "ADMIN" && (
          <>
            <Link href="/dashboard/admin/students/assign" className="flex items-center gap-2 text-foreground hover:underline">
              <UserPlus className="h-4 w-4" />
              Assign Class
            </Link>
            <Link href="/dashboard/admin/students/new" className="flex items-center gap-2 text-foreground hover:underline">
              <UserPlus className="h-4 w-4" />
              Add Student
            </Link>
            <Link href="/dashboard/admin/students" className="flex items-center gap-2 text-foreground hover:underline">
              <Users className="h-4 w-4" />
              Manage Students
            </Link>
            <Link href="/dashboard/admin/classes" className="flex items-center gap-2 text-foreground hover:underline">
              <ClipboardList className="h-4 w-4" />
              Manage Classes
            </Link>
            <Link href="/dashboard/admin/users/new" className="flex items-center gap-2 text-foreground hover:underline">
              <UserPlus className="h-4 w-4" />
              Add Teacher
            </Link>
            <Link href="/dashboard/admin/teachers" className="flex items-center gap-2 text-foreground hover:underline">
              <GraduationCap className="h-4 w-4" />
              Manage Teachers
            </Link>
          </>
        )}

        {role === "TEACHER" && (
          <>
            <Link href="/dashboard/teacher/grades" className="flex items-center gap-2 text-foreground hover:underline">
              <ClipboardList className="h-4 w-4" />
              Grades
            </Link>
            <Link href="/dashboard/teacher/attendance" className="flex items-center gap-2 text-foreground hover:underline">
              <ClipboardList className="h-4 w-4" />
              Attendance
            </Link>
            <Link href="/dashboard/teacher/attendance/view" className="flex items-center gap-2 text-foreground hover:underline">
              <ClipboardList className="h-4 w-4" />
              View Attendance
            </Link>
          </>
        )}

        <div className="mt-auto">
          <LogoutButton />
        </div>
      </MobileSidebar>

      <main className="flex-1">{children}</main>
    </div>
  );
}
