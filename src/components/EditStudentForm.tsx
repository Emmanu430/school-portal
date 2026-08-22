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

export default function EditStudentForm({
  student,
  availableUsers,
  classes,
  action,
}: {
  student: { name: string; email: string; userId: number | null; classId: number | null };
  availableUsers: UserOption[];
  classes: ClassOption[];
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

      <ClassSelect
        classes={classes}
        defaultValue={student.classId ? String(student.classId) : ""}
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