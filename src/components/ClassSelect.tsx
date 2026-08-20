    "use client";

    import { useState } from "react";
    import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    } from "@/components/ui/select";

    type ClassOption = { id: number; name: string };

    export default function ClassSelect({
    classes,
    defaultValue,
    }: {
    classes: ClassOption[];
    defaultValue?: string;
    }) {
    const [value, setValue] = useState(defaultValue ?? "");
    const selectedClass = classes.find((c) => String(c.id) === value);

    return (
        <>
        <input type="hidden" name="classId" value={value} />
        <Select value={value} onValueChange={(newValue) => setValue(newValue ?? "")}>
            <SelectTrigger className="w-full h-auto! rounded border border-border bg-input px-3 py-2 text-sm text-foreground">
            <SelectValue placeholder="Select a class">
                {selectedClass ? selectedClass.name : "Select a class"}
            </SelectValue>
            </SelectTrigger>
            <SelectContent>
            {classes.map((c) => (
                <SelectItem key={c.id} value={String(c.id)}>
                {c.name}
                </SelectItem>
            ))}
            </SelectContent>
        </Select>
        </>
    );
}