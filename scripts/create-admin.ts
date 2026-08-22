import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/prisma";

async function main() {
  const users = [
    { name: "School Admin", email: "admin@school.com", password: "admin123", role: "ADMIN" as const },
    { name: "Mr. Teacher", email: "teacher@school.com", password: "teacher123", role: "TEACHER" as const },
    { name: "Test Student", email: "student@school.com", password: "student123", role: "STUDENT" as const },
  ];

  for (const u of users) {
    const existing = await prisma.user.findUnique({ where: { email: u.email } });
    if (existing) {
      console.log("Skipped (already exists):", u.email);
      continue;
    }

    const hashedPassword = await bcrypt.hash(u.password, 10);
    const created = await prisma.user.create({
      data: {
        name: u.name,
        email: u.email,
        password: hashedPassword,
        role: u.role,
      },
    });
    console.log("Created:", created.email, created.role);
  }
}

main()
  .catch((e) => console.error(e))
  .finally(() => process.exit());