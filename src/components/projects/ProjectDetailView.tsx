"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Project, ProjectStage } from "@/lib/types";

interface ProjectDetailViewProps {
  project: Project;
  onUpdate: (id: string, updates: Partial<Project>) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

const STAGE_LABELS: Record<ProjectStage, { label: string; color: string }> = {
  idea: { label: "Idea", color: "bg-col-idea" },
  planned: { label: "Planned", color: "bg-col-todo" },
  "in-progress": { label: "In Progress", color: "bg-col-progress" },
  complete: { label: "Complete", color: "bg-col-done" },
};

export default function ProjectDetailView({
  project,
  onUpdate,
  onDelete,
  onClose,
}: ProjectDetailViewProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const debouncedUpdate = useCallback(
    (updates: Partial<Project>) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        onUpdate(project.id, updates);
      }, 500);
    },
    [project.id, onUpdate]
  );

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const handleDelete = () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    onDelete(project.id);
    onClose();
  };

  const stageInfo = STAGE_LABELS[project.stage];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-void/60 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-surface-0 border-l border-stroke z-50 flex flex-col animate-slide-in-right overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-stroke bg-surface-1/50">
          <div className="flex items-center gap-2.5">
            <div className={`w-2 h-2 rounded-full ${stageInfo.color}`} />
            <span className="text-[10px] font-[family-name:var(--font-mono)] text-text-3 uppercase tracking-[0.15em]">
              {stageInfo.label}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-text-3 hover:text-text transition-colors w-7 h-7 flex items-center justify-center rounded hover:bg-surface-3"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 2L10 10M10 2L2 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-5">
          {/* Title */}
          <input
            type="text"
            defaultValue={project.title}
            onChange={(e) => debouncedUpdate({ title: e.target.value })}
            className="text-lg font-[family-name:var(--font-display)] font-bold text-text bg-transparent border-none outline-none w-full placeholder:text-text-3"
            placeholder="Project title"
          />

          {/* Summary */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-[family-name:var(--font-mono)] text-text-3 uppercase tracking-[0.15em]">
              Summary
            </label>
            <textarea
              defaultValue={project.summary}
              onChange={(e) => debouncedUpdate({ summary: e.target.value })}
              placeholder="Brief project summary..."
              rows={3}
              className="bg-surface-2 text-[13px] text-text placeholder:text-text-3 rounded-md px-3 py-2.5 border border-stroke focus:border-gold/40 focus:outline-none focus:ring-1 focus:ring-gold/20 transition-all duration-200 resize-none leading-relaxed"
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-[family-name:var(--font-mono)] text-text-3 uppercase tracking-[0.15em]">
              Description
            </label>
            <textarea
              defaultValue={project.description}
              onChange={(e) => debouncedUpdate({ description: e.target.value })}
              placeholder="Detailed description..."
              rows={3}
              className="bg-surface-2 text-[13px] text-text placeholder:text-text-3 rounded-md px-3 py-2.5 border border-stroke focus:border-gold/40 focus:outline-none focus:ring-1 focus:ring-gold/20 transition-all duration-200 resize-none leading-relaxed"
            />
          </div>

          {/* Tech Stack */}
          <TagEditor
            label="Tech Stack"
            tags={project.tech_stack}
            onChange={(tags) => onUpdate(project.id, { tech_stack: tags })}
            placeholder="Add technology..."
          />

          {/* Files Built */}
          <TagEditor
            label="Files Built"
            tags={project.files_built}
            onChange={(tags) => onUpdate(project.id, { files_built: tags })}
            placeholder="Add file..."
          />

          {/* Key Decisions */}
          <TagEditor
            label="Key Decisions"
            tags={project.key_decisions}
            onChange={(tags) => onUpdate(project.id, { key_decisions: tags })}
            placeholder="Add decision..."
          />

          {/* Lessons Learned */}
          <TagEditor
            label="Lessons Learned"
            tags={project.lessons_learned}
            onChange={(tags) => onUpdate(project.id, { lessons_learned: tags })}
            placeholder="Add lesson..."
          />

          {/* URL */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-[family-name:var(--font-mono)] text-text-3 uppercase tracking-[0.15em]">
              URL
            </label>
            <input
              type="url"
              defaultValue={project.url ?? ""}
              onChange={(e) => debouncedUpdate({ url: e.target.value || null })}
              placeholder="https://..."
              className="bg-surface-2 text-[13px] text-text placeholder:text-text-3 rounded-md px-3 py-2 border border-stroke focus:border-gold/40 focus:outline-none focus:ring-1 focus:ring-gold/20 transition-all duration-200"
            />
          </div>

          {/* Source Log */}
          {project.source_log_path && (
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-[family-name:var(--font-mono)] text-text-3 uppercase tracking-[0.15em]">
                Source Log
              </label>
              <p className="text-[12px] font-[family-name:var(--font-mono)] text-text-3 bg-surface-2 rounded-md px-3 py-2 border border-stroke">
                {project.source_log_path}
              </p>
            </div>
          )}

          {/* Timestamps */}
          <div className="flex gap-6 text-[10px] font-[family-name:var(--font-mono)] text-text-3">
            <span>Created {new Date(project.created_at).toLocaleDateString()}</span>
            <span>Updated {new Date(project.updated_at).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-stroke">
          <button
            onClick={handleDelete}
            className={`text-[11px] font-[family-name:var(--font-mono)] uppercase tracking-wider px-3 py-2 rounded-md transition-all duration-200 ${
              confirmDelete
                ? "bg-danger text-white"
                : "text-danger hover:bg-danger/10"
            }`}
          >
            {confirmDelete ? "Confirm Delete" : "Delete Project"}
          </button>
        </div>
      </div>
    </>
  );
}

// ── Tag Editor sub-component ─────────────────────────
function TagEditor({
  label,
  tags,
  onChange,
  placeholder,
}: {
  label: string;
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder: string;
}) {
  const [input, setInput] = useState("");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || tags.includes(trimmed)) return;
    onChange([...tags, trimmed]);
    setInput("");
  };

  const handleRemove = (tag: string) => {
    onChange(tags.filter((t) => t !== tag));
  };

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] font-[family-name:var(--font-mono)] text-text-3 uppercase tracking-[0.15em]">
        {label}
      </label>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span
              key={tag}
              className="group flex items-center gap-1 text-[11px] font-[family-name:var(--font-mono)] px-2 py-1 rounded bg-surface-3 text-text-2 border border-stroke"
            >
              {tag}
              <button
                onClick={() => handleRemove(tag)}
                className="opacity-0 group-hover:opacity-100 text-text-3 hover:text-danger transition-all"
              >
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                  <path d="M1 1L7 7M7 1L1 7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
              </button>
            </span>
          ))}
        </div>
      )}
      <form onSubmit={handleAdd}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-surface-2 text-[12px] text-text placeholder:text-text-3 rounded-md px-3 py-1.5 border border-stroke focus:border-gold/40 focus:outline-none focus:ring-1 focus:ring-gold/20 transition-all duration-200"
        />
      </form>
    </div>
  );
}
