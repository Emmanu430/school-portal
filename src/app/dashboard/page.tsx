import { auth } from "@/auth";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";

export default async function Dashboard() {
    const session = await auth();

    if (!session) {
        redirect("/login");
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-center gap-2">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p>Welcome, {session.user?.name}</p>
        <p className="text-zinc-500">Role: {session.user?.role}</p>
        </main>
    );
}