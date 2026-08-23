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
        className="flex w-full max-w-sm flex-col gap-4 rounded-lg border border-border bg-card p-6"
        >
        <h1 className="text-2xl font-bold text-foreground">Add Student</h1>

        {error === "exists" && (
            <p className="text-sm text-destructive">
            A user or student with that email already exists.
            </p>
        )}

        {success === "1" && (
            <p className="text-sm text-primary">
            Student created successfully.
            </p>
        )}

        <input
            type="text"
            name="name"
            placeholder="Full Name"
            className="rounded border border-border bg-input px-3 py-2 text-foreground placeholder:text-muted-foreground"
            required
        />

        <ClassSelect classes={classes} />

        <input
            type="email"
            name="email"
            placeholder="Email"
            className="rounded border border-border bg-input px-3 py-2 text-foreground placeholder:text-muted-foreground"
            required
        />

        <div className="relative flex items-center">
            <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Temporary Password"
            minLength={6}
            className="w-full rounded border border-border bg-input px-3 py-2 pr-10 text-foreground placeholder:text-muted-foreground"
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

        

        <button
            type="submit"
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
            Create Student
        </button>
        </form>
    );
}