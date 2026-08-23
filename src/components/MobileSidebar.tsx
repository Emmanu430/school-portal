"use client";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function MobileSidebar({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) {
    return (
      <div className="p-4">
        <button type="button" onClick={() => setIsOpen(true)} className="text-foreground">
          <Menu className="h-6 w-6" />
        </button>
      </div>
    );
  }

  return (
    <aside className="w-full sm:w-64 shrink-0 border-r border-border bg-background p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="font-bold text-foreground">School Portal</span>
        <button type="button" onClick={() => setIsOpen(false)} className="text-foreground">
          <X className="h-6 w-6" />
        </button>
      </div>
      {children}
    </aside>
  );
}
