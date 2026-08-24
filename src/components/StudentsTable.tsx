    "use client";

    import { useState, useEffect } from "react";
    import Link from "next/link";

    interface StudentRow {
    id: number;
    name: string;
    email: string;
    photoUrl?: string | null;
    className?: string | null;
    }

    function initials(name: string) {
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
    }

    export function StudentsTable({ students }: { students: StudentRow[] }) {
    const [isDesktop, setIsDesktop] = useState(false);

    useEffect(() => {
        const mql = window.matchMedia("(min-width: 640px)");
        setIsDesktop(mql.matches);
        const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
        mql.addEventListener("change", handler);
        return () => mql.removeEventListener("change", handler);
    }, []);

    const Avatar = ({ student }: { student: StudentRow }) =>
        student.photoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
            src={student.photoUrl}
            alt={student.name}
            className="h-8 w-8 rounded-full object-cover"
        />
        ) : (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-semibold">
            {initials(student.name)}
        </div>
        );

    if (!isDesktop) {
        return (
        <div className="flex flex-col">
            {students.map((student) => (
            <Link
                key={student.id}
                href={`/dashboard/admin/students/${student.id}/edit`}
                className="flex items-center gap-3 py-3 border-b border-border last:border-0"
            >
                <Avatar student={student} />
                <div className="min-w-0">
                <p className="text-sm text-foreground truncate">
                    {student.name}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                    {student.className ?? "—"} · {student.email}
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
            <th className="py-2 pr-4 text-xs font-medium text-muted-foreground">
                Student
            </th>
            <th className="py-2 pr-4 text-xs font-medium text-muted-foreground">
                Class
            </th>
            <th className="py-2 pr-4 text-xs font-medium text-muted-foreground">
                Email
            </th>
            </tr>
        </thead>
        <tbody>
            {students.map((student) => (
            <tr key={student.id} className="border-b border-border last:border-0">
                <td className="py-3 pr-4">
                <Link
                    href={`/dashboard/admin/students/${student.id}/edit`}
                    className="flex items-center gap-3"
                >
                    <Avatar student={student} />
                    <span className="text-sm text-foreground hover:text-primary">
                    {student.name}
                    </span>
                </Link>
                </td>
                <td className="py-3 pr-4 text-sm text-muted-foreground">
                {student.className ?? "—"}
                </td>
                <td className="py-3 pr-4 text-sm text-muted-foreground">
                {student.email}
                </td>
            </tr>
            ))}
        </tbody>
        </table>
    );
}