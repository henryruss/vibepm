"use client";

import { useState, useEffect } from "react";
import { ProjectCategory, ProjectStage } from "@/lib/types";

interface AddProjectModalProps {
  defaultCategory: ProjectCategory;
  onAdd: (title: string, stage: ProjectStage, description?: string, category?: ProjectCategory) => void;
  onClose: () => void;
}

const STAGES: { key: ProjectStage; label: string }[] = [
  { key: "idea", label: "Idea" },
  { key: "planned", label: "Planned" },
  { key: "in-progress", label: "In Progress" },
  { key: "complete", label: "Complete" },
];

export default function AddProjectModal({ defaultCategory, onAdd, onClose }: AddProjectModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<ProjectCategory>(defaultCategory);
  const [stage, setStage] = useState<ProjectStage>("idea");

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    onAdd(trimmed, stage, description, category);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-surface-0 rounded-xl border border-stroke shadow-lg animate-shimmer-in">
          <form onSubmit={handleSubmit}>
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-stroke">
              <h2 className="font-[family-name:var(--font-display)] font-bold text-base text-text">
                New Project
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="text-text-3 hover:text-text transition-colors w-7 h-7 flex items-center justify-center rounded hover:bg-surface-3"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 2L10 10M10 2L2 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="px-5 py-5 flex flex-col gap-4">
              {/* Title */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-[family-name:var(--font-mono)] text-text-3 uppercase tracking-[0.15em]">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Project name..."
                  autoFocus
                  className="bg-surface-2 text-[13px] text-text placeholder:text-text-3 rounded-md px-3 py-2 border border-stroke focus:border-gold/40 focus:outline-none focus:ring-1 focus:ring-gold/20 transition-all duration-200"
                />
              </div>

              {/* Category */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-[family-name:var(--font-mono)] text-text-3 uppercase tracking-[0.15em]">
                  Category
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setCategory("website")}
                    className={`flex-1 flex items-center justify-center gap-2 text-[12px] font-[family-name:var(--font-mono)] py-2 rounded-md border transition-all duration-200 ${
                      category === "website"
                        ? "border-cat-website bg-cat-website/10 text-cat-website"
                        : "border-stroke text-text-3 hover:border-stroke-light"
                    }`}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="2" y1="12" x2="22" y2="12" />
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                    </svg>
                    Website
                  </button>
                  <button
                    type="button"
                    onClick={() => setCategory("agent")}
                    className={`flex-1 flex items-center justify-center gap-2 text-[12px] font-[family-name:var(--font-mono)] py-2 rounded-md border transition-all duration-200 ${
                      category === "agent"
                        ? "border-cat-agent bg-cat-agent/10 text-cat-agent"
                        : "border-stroke text-text-3 hover:border-stroke-light"
                    }`}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2a4 4 0 0 1 4 4v2a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4z" />
                      <path d="M6 10v1a6 6 0 0 0 12 0v-1" />
                      <line x1="12" y1="17" x2="12" y2="22" />
                      <line x1="8" y1="22" x2="16" y2="22" />
                    </svg>
                    Agent
                  </button>
                </div>
              </div>

              {/* Stage */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-[family-name:var(--font-mono)] text-text-3 uppercase tracking-[0.15em]">
                  Stage
                </label>
                <div className="flex gap-1.5">
                  {STAGES.map((s) => (
                    <button
                      key={s.key}
                      type="button"
                      onClick={() => setStage(s.key)}
                      className={`flex-1 text-[11px] font-[family-name:var(--font-mono)] py-1.5 rounded-md border transition-all duration-200 ${
                        stage === s.key
                          ? "border-gold bg-gold/10 text-gold"
                          : "border-stroke text-text-3 hover:border-stroke-light"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-[family-name:var(--font-mono)] text-text-3 uppercase tracking-[0.15em]">
                  Description <span className="text-text-3/50">(optional)</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description..."
                  rows={3}
                  className="bg-surface-2 text-[13px] text-text placeholder:text-text-3 rounded-md px-3 py-2.5 border border-stroke focus:border-gold/40 focus:outline-none focus:ring-1 focus:ring-gold/20 transition-all duration-200 resize-none leading-relaxed"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-stroke">
              <button
                type="button"
                onClick={onClose}
                className="text-[11px] font-[family-name:var(--font-mono)] text-text-3 hover:text-text px-3 py-2 rounded-md transition-colors uppercase tracking-wider"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!title.trim()}
                className="text-[11px] font-[family-name:var(--font-mono)] bg-gold text-white px-4 py-2 rounded-md transition-all duration-200 uppercase tracking-wider hover:bg-gold-dim disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
