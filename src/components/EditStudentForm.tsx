    "use client";

    import { useState } from "react";

    type UserOption = { id: number; name: string; email: string };

    export default function EditStudentForm({
    student,
    availableUsers,
    action,
    }: {
    student: { name: string; className: string; email: string; userId: number | null };
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
        className="flex flex-col gap-4 rounded-lg border border-border bg-card p-6"
        >
        <h1 className="text-2xl font-bold text-foreground">Edit Student</h1>

        <input
            type="text"
            name="name"
            defaultValue={isLinked ? linkedUser!.name : student.name}
            readOnly={isLinked}
            className={`rounded border px-3 py-2 ${
            isLinked
                ? "border-border bg-muted text-muted-foreground cursor-not-allowed"
                : "border-border bg-input text-foreground"
            }`}
            required
        />

        <input
            type="text"
            name="className"
            defaultValue={student.className}
            className="rounded border border-border bg-input px-3 py-2 text-foreground"
            required
        />

        <input
            type="email"
            name="email"
            defaultValue={isLinked ? linkedUser!.email : student.email}
            readOnly={isLinked}
            className={`rounded border px-3 py-2 ${
            isLinked
                ? "border-border bg-muted text-muted-foreground cursor-not-allowed"
                : "border-border bg-input text-foreground"
            }`}
            required
        />
        {isLinked && (
            <p className="text-xs text-muted-foreground -mt-2">
            Email is synced from the linked account and can&apos;t be edited here.
            </p>
        )}

        <label className="text-sm text-muted-foreground">
            Linked Account
        </label>
        <select
            name="userId"
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            className="rounded border border-border bg-input px-3 py-2 text-foreground"
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
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
            Save Changes
        </button>
        </form>
    );
}