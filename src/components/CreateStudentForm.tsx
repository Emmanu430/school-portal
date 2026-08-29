    "use client";

    import { useState } from "react";
    import { Eye, EyeOff } from "lucide-react";
    import ClassSelect from "@/components/ClassSelect";

    type ClassOption = { id: number; name: string };

    export default function CreateStudentForm({
    classes,
    action,
    error,
    success,
    }: {
    classes: ClassOption[];
    action: (formData: FormData) => void;
    error?: string;
    success?: string;
    }) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <form
        action={action}
        className="flex w-full max-w-sm flex-col gap-4 rounded-2xl border border-border bg-card p-6"
        >
        <div>
            <p className="text-xs text-primary font-medium">School directory</p>
            <h1 className="mt-1 text-xl font-medium text-foreground">Add student</h1>
        </div>

        {error === "exists" && (
            <p className="text-xs text-destructive">
            A user or student with that email already exists.
            </p>
        )}

        {success === "1" && (
            <p className="text-xs text-emerald-600">Student created successfully.</p>
        )}

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
            <label className="text-xs text-muted-foreground">Class</label>
            <div className="mt-1">
            <ClassSelect classes={classes} />
            </div>
        </div>

        <div>
            <label className="text-xs text-muted-foreground">Email</label>
            <input
            type="email"
            name="email"
            placeholder="student@example.com"
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

        <button
            type="submit"
            className="rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
            Create student
        </button>
        </form>
    );
}