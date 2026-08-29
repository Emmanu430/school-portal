    "use client";

    import { useState } from "react";
    import { Eye, EyeOff } from "lucide-react";
    import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    } from "@/components/ui/select";
    import ClassSelect from "@/components/ClassSelect";

    const SUBJECTS = [
    "Mathematics",
    "English Language",
    "Basic Science",
    "Basic Technology",
    "Physics",
    "Chemistry",
    "Biology",
    "Agricultural Science",
    "Economics",
    "Government",
    "Civic Education",
    "Christian Religious Studies",
    "Islamic Religious Studies",
    "Yoruba",
    "French",
    "Computer Studies",
    "Physical and Health Education",
    "Business Studies",
    "Financial Accounting",
    "Literature in English",
    "Geography",
    "History",
    ];

    export default function CreateUserForm({
    action,
    success,
    classes,
    }: {
    action: (formData: FormData) => void;
    success?: boolean;
    classes: { id: number; name: string }[];
    }) {
    const [showPassword, setShowPassword] = useState(false);
    const [role, setRole] = useState("TEACHER");
    const [subject, setSubject] = useState("");

    return (
        <form
        action={action}
        className="flex w-full max-w-sm flex-col gap-4 rounded-2xl border border-border bg-card p-6"
        >
        <div>
            <p className="text-xs text-primary font-medium">School directory</p>
            <h1 className="mt-1 text-xl font-medium text-foreground">Create staff account</h1>
        </div>

        {success && <p className="text-xs text-emerald-600">Account created.</p>}

        <div>
            <label className="text-xs text-muted-foreground">Full name</label>
            <input
            type="text"
            name="name"
            placeholder="e.g. Alabi Emmanuel"
            className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground"
            required
            />
        </div>

        <div>
            <label className="text-xs text-muted-foreground">Email</label>
            <input
            type="email"
            name="email"
            placeholder="staff@example.com"
            className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground"
            required
            />
        </div>

        <div>
            <label className="text-xs text-muted-foreground">Temporary password</label>
            <div className="relative flex items-center mt-1">
            <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="At least 6 characters"
                minLength={6}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 pr-10 text-sm text-foreground placeholder:text-muted-foreground"
                required
            />
            <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-muted-foreground"
            >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
            </div>
        </div>

        <div>
            <label className="text-xs text-muted-foreground">Role</label>
            <input type="hidden" name="role" value={role} />
            <div className="mt-1">
            <Select value={role} onValueChange={(v) => setRole(v ?? "TEACHER")}>
                <SelectTrigger className="w-full h-auto! rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground">
                <SelectValue>{role === "ADMIN" ? "Admin" : "Teacher"}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                <SelectItem value="TEACHER">Teacher</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
                </SelectContent>
            </Select>
            </div>
        </div>

        {role === "TEACHER" && (
            <>
            <div>
                <label className="text-xs text-muted-foreground">Subject</label>
                <input type="hidden" name="subject" value={subject} />
                <div className="mt-1">
                <Select value={subject} onValueChange={(v) => setSubject(v ?? "")}>
                    <SelectTrigger className="w-full h-auto! rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground">
                    <SelectValue placeholder="Select a subject">
                        {subject || "Select a subject"}
                    </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                    {SUBJECTS.map((s) => (
                        <SelectItem key={s} value={s}>
                        {s}
                        </SelectItem>
                    ))}
                    </SelectContent>
                </Select>
                </div>
            </div>

            <div>
                <label className="text-xs text-muted-foreground">Class</label>
                <div className="mt-1">
                <ClassSelect classes={classes} />
                </div>
            </div>
            </>
        )}

        <button
            type="submit"
            className="rounded-full bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
            Create account
        </button>
        </form>
    );
}