"use client";

import { useState } from "react";
import { ProjectStage } from "@/lib/types";

const PLACEHOLDERS: Record<ProjectStage, string> = {
  idea: "What's the idea?",
  planned: "What are you planning?",
  "in-progress": "What are you working on?",
  complete: "What did you finish?",
};

interface AddCardFormProps {
  columnId: ProjectStage;
  onAdd: (title: string, stage: ProjectStage, description?: string) => void;
}

export default function AddCardForm({ columnId, onAdd }: AddCardFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    onAdd(trimmed, columnId);
    setTitle("");
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
      setTitle("");
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="
          w-full text-left text-[12px] font-[family-name:var(--font-mono)]
          text-text-3 hover:text-text-2 px-2 py-2 rounded-md
          hover:bg-surface-3/50 transition-all duration-200
          flex items-center gap-2
        "
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="opacity-50">
          <path d="M6 2V10M2 6H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        Add card
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 animate-shimmer-in">
      <input
        autoFocus
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => {
          if (!title.trim()) setIsOpen(false);
        }}
        placeholder={PLACEHOLDERS[columnId]}
        className="
          w-full bg-surface-3 text-[13px] text-text placeholder:text-text-3
          rounded-md px-3 py-2 border border-stroke
          focus:border-gold/40 focus:outline-none focus:ring-1 focus:ring-gold/20
          transition-all duration-200
        "
      />
      <div className="flex gap-2">
        <button
          type="submit"
          className="
            text-[11px] font-[family-name:var(--font-mono)] font-medium uppercase tracking-wider
            bg-gold hover:bg-gold-dim text-white
            px-3 py-1.5 rounded-md transition-all duration-200
          "
        >
          Add
        </button>
        <button
          type="button"
          onClick={() => {
            setIsOpen(false);
            setTitle("");
          }}
          className="text-[11px] font-[family-name:var(--font-mono)] text-text-3 hover:text-text-2 px-2 py-1.5 transition-colors duration-200"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
