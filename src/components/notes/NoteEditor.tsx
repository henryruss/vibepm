"use client";

import { useState, useEffect } from "react";
import { NoteData } from "@/lib/types";

interface NoteEditorProps {
  note: NoteData;
  onUpdate: (content: string) => void;
}

export default function NoteEditor({ note, onUpdate }: NoteEditorProps) {
  const [localContent, setLocalContent] = useState(note.content);

  useEffect(() => {
    setLocalContent(note.content);
  }, [note.content]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setLocalContent(value);
    onUpdate(value);
  };

  return (
    <div className="flex flex-col gap-2 flex-1 min-h-0">
      {/* Section header */}
      <div className="flex items-center gap-2 px-4">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-gold">
          <path d="M2 2H10M2 5H8M2 8H6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
        <h3 className="text-[11px] font-[family-name:var(--font-display)] font-semibold text-text-2 uppercase tracking-[0.15em]">
          Notes
        </h3>
      </div>

      {/* Textarea */}
      <textarea
        value={localContent}
        onChange={handleChange}
        placeholder="Jot something down..."
        className="
          flex-1 min-h-[140px] bg-surface-2 text-[13px] text-text
          placeholder:text-text-3 rounded-md px-3 py-2.5 mx-3
          border border-stroke
          focus:border-gold/40 focus:outline-none focus:ring-1 focus:ring-gold/20
          transition-all duration-200 resize-none
          leading-relaxed
        "
      />
    </div>
  );
}
