import Link from "next/link";
import { LandingButtons } from "@/components/LandingButtons";
import { School, Users, GraduationCap, ClipboardList } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-5 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary">
        <School className="h-7 w-7 text-primary-foreground" />
      </div>

      <div>
        <h1 className="text-3xl sm:text-5xl font-medium text-foreground">
          School Portal
        </h1>
        <p className="mt-3 max-w-sm sm:max-w-md text-sm sm:text-base text-muted-foreground">
          Manage students, teachers, grades, and attendance — all in one place.
        </p>
      </div>

      
      <LandingButtons />
      <div className="mt-8 grid grid-cols-3 gap-6 sm:gap-10 max-w-sm sm:max-w-md">
        <div className="flex flex-col items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
            <GraduationCap className="h-4 w-4 text-primary" />
          </div>
          <p className="text-xs text-muted-foreground">Students</p>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/25">
            <Users className="h-4 w-4 text-accent-foreground" />
          </div>
          <p className="text-xs text-muted-foreground">Teachers</p>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
            <ClipboardList className="h-4 w-4 text-primary" />
          </div>
          <p className="text-xs text-muted-foreground">Attendance</p>
        </div>
      </div>
    </main>
  );
}