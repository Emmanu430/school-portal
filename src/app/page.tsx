import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background">
      <h1 className="text-4xl font-bold text-foreground">School Portal</h1>
      <p className="text-muted-foreground">Manage students, teachers, grades, and attendance.</p>
      <div className="flex gap-4">
        <Link
          href="/login"
          className="rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Log In
        </Link>
        <Link
          href="/register"
          className="rounded-md border border-border px-6 py-3 text-sm font-medium text-foreground hover:bg-muted"
        >
          Register
        </Link>
      </div>
    </main>
  );
}