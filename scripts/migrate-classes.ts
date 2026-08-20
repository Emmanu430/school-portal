    import "dotenv/config";
    import { prisma } from "../src/lib/prisma";

    async function main() {
    // Collect every unique class name currently used across Students and Teachers
    const studentClasses = await prisma.student.findMany({
        select: { className: true },
        distinct: ["className"],
    });

    const teacherClasses = await prisma.teacher.findMany({
        where: { assignedClass: { not: null } },
        select: { assignedClass: true },
        distinct: ["assignedClass"],
    });

    const allNames = new Set<string>();
    studentClasses.forEach((s) => allNames.add(s.className));
    teacherClasses.forEach((t) => {
        if (t.assignedClass) allNames.add(t.assignedClass);
    });

    console.log("Found class names:", [...allNames]);

    // Create a real Class row for each unique name
    for (const name of allNames) {
        await prisma.class.upsert({
        where: { name },
        update: {},
        create: { name },
        });
    }

    // Link every Student to its matching Class
    const allStudents = await prisma.student.findMany();
    for (const student of allStudents) {
        const matchingClass = await prisma.class.findUnique({
        where: { name: student.className },
        });
        if (matchingClass) {
        await prisma.student.update({
            where: { id: student.id },
            data: { classId: matchingClass.id },
        });
        }
    }

    // Link every Teacher (with an assignedClass) to its matching Class
    const allTeachers = await prisma.teacher.findMany({
        where: { assignedClass: { not: null } },
    });
    for (const teacher of allTeachers) {
        const matchingClass = await prisma.class.findUnique({
        where: { name: teacher.assignedClass! },
        });
        if (matchingClass) {
        await prisma.teacher.update({
            where: { id: teacher.id },
            data: { classId: matchingClass.id },
        });
        }
    }

    console.log("Migration complete.");
    }

    main()
    .catch((e) => console.error(e))
  .finally(() => process.exit());