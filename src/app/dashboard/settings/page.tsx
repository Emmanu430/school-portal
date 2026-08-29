    import { auth } from "@/auth";
    import { redirect } from "next/navigation";
    import ChangePasswordForm from "@/components/ChangePasswordForm";

    export default async function SettingsPage() {
    const session = await auth();

    if (!session) {
        redirect("/login");
    }

    return (
        <main className="min-h-screen bg-background p-5 sm:p-8">
        <p className="text-xs text-primary font-medium">Account</p>
        <h1 className="mt-1 text-2xl sm:text-3xl font-medium text-foreground">
            Settings
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
            Manage your account security.
        </p>

        <div className="mt-6 max-w-md rounded-2xl border border-border bg-card p-6">
            <h2 className="text-sm font-medium text-foreground mb-4">
            Change password
            </h2>
            <ChangePasswordForm />
        </div>
        </main>
    );
}