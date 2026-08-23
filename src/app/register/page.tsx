    import { redirect } from "next/navigation";
    import bcrypt from "bcryptjs";
    import { prisma } from "@/lib/prisma";
    import RegisterForm from "@/components/RegisterForm";

    export default function RegisterPage() {
    async function registerUser(formData: FormData) {
        "use server";

        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
        redirect("/register?error=exists");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            role: "STUDENT",
        },
        });

        redirect("/login");
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-background px-4">
        <RegisterForm action={registerUser} />
        </main>
    );
}