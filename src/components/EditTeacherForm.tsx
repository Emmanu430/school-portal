    "use client";

    import { useState } from "react";
    import ClassSelect from "@/components/ClassSelect";
    import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    } from "@/components/ui/select";

    type UserOption = { id: number; name: string; email: string };
    type ClassOption = { id: number; name: string };

    export default function EditTeacherForm({
    teacher,
    availableUsers,
    classes,
    action,
    }: {
    teacher: { name: string; subject: string; email: string; userId: number | null; classId: number | null };
    availableUsers: UserOption[];
    classes: ClassOption[];
    action: (formData: FormData) => void;
    }) {
    const [selectedUserId, setSelectedUserId] = useState<string>(
        teacher.userId ? String(teacher.userId) : ""
    );

    const linkedUser = availableUsers.find((u) => String(u.id) === selectedUserId);
    const isLinked = !!linkedUser;

    return (
        <form
        action={action}
        className="flex flex-col gap-4 rounded-lg border border-border bg-card p-6"
        >
        <h1 className="text-2xl font-bold text-foreground">Edit Teacher</h1>

        <input
            type="text"
            name="name"
            defaultValue={isLinked ? linkedUser!.name : teacher.name}
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
            name="subject"
            defaultValue={teacher.subject}
            className="rounded border border-border bg-input px-3 py-2 text-foreground"
            required
        />

        <input
            type="email"
            name="email"
            defaultValue={isLinked ? linkedUser!.email : teacher.email}
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
            Name and email are synced from the linked account.
            </p>
        )}

        <label className="text-sm text-muted-foreground">
            Assigned Class
        </label>
        <ClassSelect
            classes={classes}
            defaultValue={teacher.classId ? String(teacher.classId) : ""}
        />

        <label className="text-sm text-muted-foreground">
            Linked Account
        </label>
        <input type="hidden" name="userId" value={selectedUserId} />
        <Select value={selectedUserId} onValueChange={(v) => setSelectedUserId(v ?? "")}>
            <SelectTrigger className="w-full !h-auto rounded border border-border bg-input px-3 py-2 text-sm text-foreground">
            <SelectValue placeholder="— No linked account —">
                {linkedUser ? `${linkedUser.name} (${linkedUser.email})` : "— No linked account —"}
            </SelectValue>
            </SelectTrigger>
            <SelectContent>
            <SelectItem value="none">— No linked account —</SelectItem>
            {availableUsers.map((user) => (
                <SelectItem key={user.id} value={String(user.id)}>
                {user.name} ({user.email})
                </SelectItem>
            ))}
            </SelectContent>
        </Select>

        <button
            type="submit"
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
            Save Changes
        </button>
        </form>
    );
}