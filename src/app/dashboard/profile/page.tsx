    import { auth } from "@/auth";
    import { redirect } from "next/navigation";
    import { prisma } from "@/lib/prisma";
    import { revalidatePath } from "next/cache";
    import ProfilePhotoUpload from "@/components/UserPhotoUpload";

    export default async function ProfilePage() {
    const session = await auth();

    if (!session) {
        redirect("/login");
    }

    const user = await prisma.user.findUnique({
        where: { id: Number(session.user.id) },
        select: { id: true, name: true, email: true, role: true, image: true },
    });

    if (!user) {
        redirect("/login");
    }

    async function saveImage(url: string) {
        "use server";
        await prisma.user.update({
        where: { id: user!.id },
        data: { image: url },
        });
        revalidatePath("/dashboard/profile");
    }

    return (
        <main className="min-h-screen bg-background p-5 sm:p-8">
        <p className="text-xs text-primary font-medium">Account</p>
        <h1 className="mt-1 text-2xl sm:text-3xl font-medium text-foreground">
            Profile
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
            Manage your account photo and details.
        </p>

        <div className="mt-6 max-w-md rounded-2xl border border-border bg-card p-6">
            <ProfilePhotoUpload currentPhotoUrl={user.image} onSaved={saveImage} />

            <div className="mt-6 flex flex-col gap-4">
            <div>
                <p className="text-xs text-muted-foreground">Name</p>
                <p className="text-sm text-foreground">{user.name}</p>
            </div>
            <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-sm text-foreground">{user.email}</p>
            </div>
            <div>
                <p className="text-xs text-muted-foreground">Role</p>
                <p className="text-sm text-foreground">{user.role}</p>
            </div>
            </div>
        </div>
        </main>
    );
}