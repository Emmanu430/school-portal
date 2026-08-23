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

    return (
        <form
        action={action}
        className="flex w-full max-w-sm flex-col gap-4 rounded-lg border border-border bg-card p-6"
        >
        <h1 className="text-2xl font-bold text-foreground">Create Staff Account</h1>

        {success && (
            <p className="text-sm text-primary">
            Account created. Now link it to a teacher record from Manage Teachers.
            </p>
        )}

        <input
            type="text"
            name="name"
            placeholder="Full Name"
            className="rounded border border-border bg-input px-3 py-2 text-foreground placeholder:text-muted-foreground"
            required
        />

        <input
            type="email"
            name="email"
            placeholder="Email"
            className="rounded border border-border bg-input px-3 py-2 text-foreground placeholder:text-muted-foreground"
            required
        />

        <div className="relative  flex items-center">
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
            className="absolute right-3  text-muted-foreground"
            >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
        </div>

        <input type="hidden" name="role" value={role} />
        <Select value={role} onValueChange={(v) => setRole(v ?? "TEACHER")}>
            <SelectTrigger className="w-full !h-auto rounded border border-border bg-input px-3 py-2 text-sm text-foreground">
            <SelectValue>{role === "ADMIN" ? "Admin" : "Teacher"}</SelectValue>
            </SelectTrigger>
            <SelectContent>
            <SelectItem value="TEACHER">Teacher</SelectItem>
            <SelectItem value="ADMIN">Admin</SelectItem>
            </SelectContent>
        </Select>

        {role === "TEACHER" && (
            <>
            <input
                type="text"
                name="subject"
                placeholder="Subject (e.g. Mathematics)"
                className="rounded border border-border bg-input px-3 py-2 text-foreground placeholder:text-muted-foreground"
                required
            />
            <ClassSelect classes={classes} />
            </>
        )}

        <button
            type="submit"
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
            Create Account
        </button>
        </form>
    );
}