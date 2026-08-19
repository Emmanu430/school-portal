    import { prisma } from "@/lib/prisma";
    import { redirect } from "next/navigation";
    import { Resend } from "resend";
    import crypto from "crypto";

    const resend = new Resend(process.env.RESEND_API_KEY);

    export default async function ForgotPasswordPage({
    searchParams,
    }: {
    searchParams: Promise<{ sent?: string }>;
    }) {
    const { sent } = await searchParams;

    async function requestReset(formData: FormData) {
        "use server";

        const email = formData.get("email") as string;

        const user = await prisma.user.findUnique({ where: { email } });

        if (user) {
        const token = crypto.randomBytes(32).toString("hex");
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

        await prisma.passwordResetToken.create({
            data: { token, userId: user.id, expiresAt },
        });

        const resetUrl = `http://localhost:3000/reset-password?token=${token}`;

        await resend.emails.send({
            from: "onboarding@resend.dev",
            to: email,
            subject: "Reset your School Portal password",
            html: `<p>Click the link below to reset your password. This link expires in 1 hour.</p>
                <p><a href="${resetUrl}">${resetUrl}</a></p>`,
        });
        }

        redirect("/forgot-password?sent=1");
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-background">
        {sent ? (
            <p className="text-center text-foreground max-w-sm">
            If that email exists in our system, a reset link has been sent. Check your inbox.
            </p>
        ) : (
            <form
            action={requestReset}
            className="flex w-full max-w-sm flex-col gap-4 rounded-lg border border-border bg-card p-6"
            >
            <h1 className="text-2xl font-bold text-foreground">Forgot Password</h1>
            <p className="text-sm text-muted-foreground">
                Enter your email and we&apos;ll send you a reset link.
            </p>

            <input
                type="email"
                name="email"
                placeholder="Email"
                className="rounded border border-border bg-input px-3 py-2 text-foreground placeholder:text-muted-foreground"
                required
            />

            <button
                type="submit"
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
                Send Reset Link
            </button>
            </form>
        )}
        </main>
    );
}