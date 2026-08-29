    "use server";

    import { auth } from "@/auth";
    import { prisma } from "@/lib/prisma";
    import bcrypt from "bcryptjs";

    export async function changePassword({
    currentPassword,
    newPassword,
    }: {
    currentPassword: string;
    newPassword: string;
    }): Promise<{ success: boolean; message: string }> {
    const session = await auth();

    if (!session) {
        return { success: false, message: "Not authenticated." };
    }

    const user = await prisma.user.findUnique({
        where: { id: Number(session.user.id) },
    });

    if (!user) {
        return { success: false, message: "User not found." };
    }

    const passwordsMatch = await bcrypt.compare(currentPassword, user.password);

    if (!passwordsMatch) {
        return { success: false, message: "Current password is incorrect." };
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedNewPassword },
    });

    return { success: true, message: "Password updated." };
}