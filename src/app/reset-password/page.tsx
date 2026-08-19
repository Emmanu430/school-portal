    import { prisma } from "@/lib/prisma";
    import { redirect } from "next/navigation";
    import bcrypt from "bcryptjs";
    import ResetPasswordForm from "@/components/ResetPasswordForm";

    export default async function ResetPasswordPage({
    searchParams,
    }: {
    searchParams: Promise<{ token?: string }>;
    }) {
    const { token } = await searchParams;

    if (!token) {
        redirect("/forgot-password");
    }

    const resetToken = await prisma.passwordResetToken.findUnique({
        where: { token },
    });

    const isValid = resetToken && resetToken.expiresAt > new Date();

    async function resetPassword(formData: FormData) {
        "use server";

        const newPassword = formData.get("password") as string;

        const currentToken = await prisma.passwordResetToken.findUnique({
        where: { token },
        });

        if (!currentToken || currentToken.expiresAt < new Date()) {
        redirect("/forgot-password?error=expired");
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await prisma.user.update({
        where: { id: currentToken.userId },
        data: { password: hashedPassword },
        });

        await prisma.passwordResetToken.delete({
        where: { token },
        });

        redirect("/login?reset=success");
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-background">
        {isValid ? (
            <ResetPasswordForm action={resetPassword} />
        ) : (
            <p className="text-center text-destructive max-w-sm">
            This reset link is invalid or has expired. Please request a new one.
            </p>
        )}
        </main>
    );
}