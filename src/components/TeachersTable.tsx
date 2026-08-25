    "use client";

    import { useState, useEffect } from "react";
    import Link from "next/link";

    interface TeacherRow {
    id: number;
    name: string;
    email: string;
    subject: string;
    }

    function initials(name: string) {
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
    }

    export function TeachersTable({ teachers }: { teachers: TeacherRow[] }) {
    const [isDesktop, setIsDesktop] = useState(false);

    useEffect(() => {
        const mql = window.matchMedia("(min-width: 640px)");
        setIsDesktop(mql.matches);
        const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
        mql.addEventListener("change", handler);
        return () => mql.removeEventListener("change", handler);
    }, []);

    const Avatar = ({ teacher }: { teacher: TeacherRow }) => (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-semibold">
        {initials(teacher.name)}
        </div>
    );

    if (!isDesktop) {
        return (
        <div className="flex flex-col">
            {teachers.map((teacher) => (
            <Link
                key={teacher.id}
                href={`/dashboard/admin/teachers/${teacher.id}/edit`}
                className="flex items-center gap-3 py-3 border-b border-border last:border-0"
            >
                <Avatar teacher={teacher} />
                <div className="min-w-0">
                <p className="text-sm text-foreground truncate">
                    {teacher.name}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                    {teacher.subject} · {teacher.email}
                </p>
                </div>
            </Link>
            ))}
        </div>
        );
    }

    return (
        <table className="w-full border-collapse">
        <thead>
            <tr className="border-b border-border text-left">
            <th className="py-2 pr-4 text-xs font-medium text-muted-foreground">Teacher</th>
            <th className="py-2 pr-4 text-xs font-medium text-muted-foreground">Subject</th>
            <th className="py-2 pr-4 text-xs font-medium text-muted-foreground">Email</th>
            </tr>
        </thead>
        <tbody>
            {teachers.map((teacher) => (
            <tr key={teacher.id} className="border-b border-border last:border-0">
                <td className="py-3 pr-4">
                <Link href={`/dashboard/admin/teachers/${teacher.id}/edit`} className="flex items-center gap-3">
                    <Avatar teacher={teacher} />
                    <span className="text-sm text-foreground hover:text-primary">{teacher.name}</span>
                </Link>
                </td>
                <td className="py-3 pr-4 text-sm text-muted-foreground">{teacher.subject}</td>
                <td className="py-3 pr-4 text-sm text-muted-foreground">{teacher.email}</td>
            </tr>
            ))}
        </tbody>
        </table>
    );
}