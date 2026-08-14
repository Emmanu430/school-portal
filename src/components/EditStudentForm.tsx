    "use client";

    import { useState } from "react";

    type UserOption = { id: number; name: string; email: string };

    export default function EditStudentForm({
    student,
    availableUsers,
    action,
    }: {
    student: { name: string; grade: string; email: string; userId: number | null };
    availableUsers: UserOption[];
    action: (formData: FormData) => void;
    }) {
    const [selectedUserId, setSelectedUserId] = useState<string>(
        student.userId ? String(student.userId) : ""
    );

    const linkedUser = availableUsers.find((u) => String(u.id) === selectedUserId);
    const isLinked = !!linkedUser;

    return (
        <form
        action={action}
        className="flex flex-col gap-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6"
        >
        <h1 className="text-2xl font-bold text-black dark:text-white">Edit Student</h1>

        <input
            type="text"
            name="name"
            defaultValue={student.name}
            className="rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-black dark:text-white"
            required
        />

        <input
            type="text"
            name="grade"
            defaultValue={student.grade}
            className="rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-black dark:text-white"
            required
        />

        <input
            type="email"
            name="email"
            defaultValue={isLinked ? linkedUser!.email : student.email}
            readOnly={isLinked}
            className={`rounded border px-3 py-2 ${
            isLinked
                ? "border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 cursor-not-allowed"
                : "border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-black dark:text-white"
            }`}
            required
        />
        {isLinked && (
            <p className="text-xs text-zinc-500 dark:text-zinc-400 -mt-2">
            Email is synced from the linked account and can&apos;t be edited here.
            </p>
        )}

        <label className="text-sm text-zinc-600 dark:text-zinc-400">
            Linked Account
        </label>
        <select
            name="userId"
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            className="rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-black dark:text-white"
        >
            <option value="">— No linked account —</option>
            {availableUsers.map((user) => (
            <option key={user.id} value={user.id}>
                {user.name} ({user.email})
            </option>
            ))}
        </select>

        <button
            type="submit"
            className="rounded bg-black dark:bg-white px-4 py-2 text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200"
        >
            Save Changes
        </button>
        </form>
    );
}