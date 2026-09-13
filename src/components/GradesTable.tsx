    "use client";

    import { useState, useEffect } from "react";
    import Link from "next/link";

    interface GradeRow {
    id: number;
    studentName: string;
    subject: string;
    term: string;
    score: number;
    }

    export function GradesTable({ grades }: { grades: GradeRow[] }) {
    const [isDesktop, setIsDesktop] = useState(false);

    useEffect(() => {
        const mql = window.matchMedia("(min-width: 640px)");
        setIsDesktop(mql.matches);
        const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
        mql.addEventListener("change", handler);
        return () => mql.removeEventListener("change", handler);
    }, []);

    if (!isDesktop) {
        return (
        <div className="flex flex-col">
            {grades.map((grade) => (
            <Link
                key={grade.id}
                href={`/dashboard/teacher/grades/${grade.id}/edit`}
                className="flex items-center justify-between py-3 border-b border-border last:border-0"
            >
                <div className="min-w-0">
                <p className="text-sm text-foreground truncate">{grade.studentName}</p>
                <p className="text-xs text-muted-foreground truncate">{grade.subject} · {grade.term}</p>
                </div>
                <span className="text-sm font-medium text-foreground">{grade.score}</span>
            </Link>
            ))}
        </div>
        );
    }

    return (
        <table className="w-full border-collapse">
        <thead>
            <tr className="border-b border-border text-left">
            <th className="py-2 pr-4 text-xs font-medium text-muted-foreground">Student</th>
            <th className="py-2 pr-4 text-xs font-medium text-muted-foreground">Subject</th>
            <th className="py-2 pr-4 text-xs font-medium text-muted-foreground">Term</th>
            <th className="py-2 pr-4 text-xs font-medium text-muted-foreground">Score</th>
            </tr>
        </thead>
        <tbody>
            {grades.map((grade) => (
            <tr key={grade.id} className="border-b border-border last:border-0">
                <td className="py-3 pr-4 text-sm text-foreground">{grade.studentName}</td>
                <td className="py-3 pr-4 text-sm text-muted-foreground">
                <Link href={`/dashboard/teacher/grades/${grade.id}/edit`} className="hover:text-primary hover:underline">
                    {grade.subject}
                </Link>
                </td>
                <td className="py-3 pr-4 text-sm text-muted-foreground">{grade.term}</td>
                <td className="py-3 pr-4 text-sm text-muted-foreground">{grade.score}</td>
            </tr>
            ))}
        </tbody>
        </table>
    );
    }