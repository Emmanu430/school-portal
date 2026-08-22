    "use client";

    import { useState } from "react";
    import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    } from "@/components/ui/select";

    type Option = { value: string; label: string };

    export default function FormSelect({
    name,
    options,
    defaultValue,
    placeholder = "Select...",
    }: {
    name: string;
    options: Option[];
    defaultValue?: string;
    placeholder?: string;
    }) {
    const [value, setValue] = useState(defaultValue ?? "");

    const selected = options.find((o) => o.value === value);

    return (
        <>
        <input type="hidden" name={name} value={value} />
        <Select value={value} onValueChange={(v) => setValue(v ?? "")}>
            <SelectTrigger className="w-full h-auto! rounded border border-border bg-input px-3 py-2 text-sm text-foreground">
            <SelectValue placeholder={placeholder}>
                {selected ? selected.label : placeholder}
            </SelectValue>
            </SelectTrigger>
            <SelectContent>
            {options.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                {o.label}
                </SelectItem>
            ))}
            </SelectContent>
        </Select>
        </>
    );
}