import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/prisma";

async function main() {
    const hashedPassword = await bcrypt.hash("admin123", 10);

    const admin = await prisma.user.create({
        data: {
        name: "School Admin",
        email: "admin@school.com",
        password: hashedPassword,
        role: "ADMIN",
        },
    });

    console.log("Created admin user:", admin);
}

main()
    .catch((e) => console.error(e))
    .finally(() => process.exit());