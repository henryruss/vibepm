"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Project, ProjectStage, ProjectCategory } from "@/lib/types";
import { getStatusLabel, getStatusColor, getStatusDot } from "@/lib/projectUtils";
import { useSupabaseTodos } from "@/hooks/useSupabaseTodos";
import { useSupabaseNotes } from "@/hooks/useSupabaseNotes";
import TodoList from "@/components/todos/TodoList";
import NoteEditor from "@/components/notes/NoteEditor";

interface ProjectDetailViewProps {
  project: Project;
  onUpdate: (id: string, updates: Partial<Project>) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
  isOwner: boolean;
}

const STAGE_OPTIONS: { key: ProjectStage; label: string }[] = [
  { key: "idea", label: "Idea" },
  { key: "planned", label: "Planned" },
  { key: "in-progress", label: "In Progress" },
  { key: "complete", label: "Complete" },
];

const CATEGORY_STYLES: Record<ProjectCategory, string> = {
  website: "border-cat-website bg-cat-website/10 text-cat-website",
  agent: "border-cat-agent bg-cat-agent/10 text-cat-agent",
};

const CATEGORY_OPTIONS: { key: ProjectCategory; label: string }[] = [
  { key: "website", label: "Website" },
  { key: "agent", label: "Agent" },
];

export default function ProjectDetailView({
  project,
  onUpdate,
  onDelete,
  onClose,
  isOwner,
}: ProjectDetailViewProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const todos = useSupabaseTodos(isOwner ? project.id : undefined);
  const notes = useSupabaseNotes(isOwner ? project.id : undefined);

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

  const statusLabel = getStatusLabel(project);
  const statusColor = getStatusColor(project);
  const dotColor = getStatusDot(project);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-2xl bg-surface-0 border-l border-stroke z-50 flex flex-col animate-slide-in-right overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stroke bg-surface-1/50">
          <div className="flex items-center gap-3">
            {/* Category badge */}
            <span className={`text-[10px] font-[family-name:var(--font-mono)] uppercase tracking-wider px-2 py-0.5 rounded-full border ${
              project.category === "agent"
                ? "text-cat-agent bg-cat-agent/10 border-cat-agent/30"
                : "text-cat-website bg-cat-website/10 border-cat-website/30"
            }`}>
              {project.category}
            </span>
            {/* Status badge */}
            <span className={`flex items-center gap-1.5 text-[10px] font-[family-name:var(--font-mono)] uppercase tracking-wider px-2 py-0.5 rounded-full border ${statusColor}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
              {statusLabel}
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
        <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">
          {/* Title */}
          {isOwner ? (
            <input
              type="text"
              defaultValue={project.title}
              onChange={(e) => debouncedUpdate({ title: e.target.value })}
              className="text-xl font-[family-name:var(--font-display)] font-bold text-text bg-transparent border-none outline-none w-full placeholder:text-text-3"
              placeholder="Project title"
            />
          ) : (
            <h2 className="text-xl font-[family-name:var(--font-display)] font-bold text-text">
              {project.title}
            </h2>
          )}

          {/* Category + Stage selectors (owner) or static badges (public) */}
          {isOwner ? (
            <div className="flex gap-4">
              <div className="flex flex-col gap-1.5 flex-1">
                <label className="text-[10px] font-[family-name:var(--font-mono)] text-text-3 uppercase tracking-[0.15em]">
                  Category
                </label>
                <div className="flex gap-1.5">
                  {CATEGORY_OPTIONS.map((c) => (
                    <button
                      key={c.key}
                      onClick={() => onUpdate(project.id, { category: c.key })}
                      className={`flex-1 text-[11px] font-[family-name:var(--font-mono)] py-1.5 rounded-md border transition-all duration-200 ${
                        project.category === c.key
                          ? CATEGORY_STYLES[c.key]
                          : "border-stroke text-text-3 hover:border-stroke-light"
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-1.5 flex-1">
                <label className="text-[10px] font-[family-name:var(--font-mono)] text-text-3 uppercase tracking-[0.15em]">
                  Stage
                </label>
                <div className="flex gap-1">
                  {STAGE_OPTIONS.map((s) => (
                    <button
                      key={s.key}
                      onClick={() => onUpdate(project.id, { stage: s.key })}
                      className={`flex-1 text-[10px] font-[family-name:var(--font-mono)] py-1.5 rounded-md border transition-all duration-200 ${
                        project.stage === s.key
                          ? "border-gold bg-gold/10 text-gold"
                          : "border-stroke text-text-3 hover:border-stroke-light"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : null}

          {/* Summary */}
          {isOwner ? (
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
          ) : project.summary ? (
            <p className="text-[14px] text-text-2 leading-relaxed">{project.summary}</p>
          ) : null}

          {/* Description */}
          {isOwner ? (
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
          ) : project.description ? (
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-[family-name:var(--font-mono)] text-text-3 uppercase tracking-[0.15em]">
                Description
              </label>
              <p className="text-[13px] text-text-2 leading-relaxed">{project.description}</p>
            </div>
          ) : null}

          {/* Tech Stack */}
          {isOwner ? (
            <TagEditor
              label="Tech Stack"
              tags={project.tech_stack}
              onChange={(tags) => onUpdate(project.id, { tech_stack: tags })}
              placeholder="Add technology..."
            />
          ) : project.tech_stack.length > 0 ? (
            <ReadOnlyTags label="Tech Stack" tags={project.tech_stack} />
          ) : null}

          {/* Key Decisions */}
          {isOwner ? (
            <TagEditor
              label="Key Decisions"
              tags={project.key_decisions}
              onChange={(tags) => onUpdate(project.id, { key_decisions: tags })}
              placeholder="Add decision..."
            />
          ) : project.key_decisions.length > 0 ? (
            <ReadOnlyTags label="Key Decisions" tags={project.key_decisions} />
          ) : null}

          {/* Lessons Learned */}
          {isOwner ? (
            <TagEditor
              label="Lessons Learned"
              tags={project.lessons_learned}
              onChange={(tags) => onUpdate(project.id, { lessons_learned: tags })}
              placeholder="Add lesson..."
            />
          ) : project.lessons_learned.length > 0 ? (
            <ReadOnlyTags label="Lessons Learned" tags={project.lessons_learned} />
          ) : null}

          {/* Files Built — owner only */}
          {isOwner && (
            <TagEditor
              label="Files Built"
              tags={project.files_built}
              onChange={(tags) => onUpdate(project.id, { files_built: tags })}
              placeholder="Add file..."
            />
          )}

          {/* Links */}
          {isOwner ? (
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-[family-name:var(--font-mono)] text-text-3 uppercase tracking-[0.15em]">
                  Live URL
                </label>
                <input
                  type="url"
                  defaultValue={project.url ?? ""}
                  onChange={(e) => debouncedUpdate({ url: e.target.value || null })}
                  placeholder="https://..."
                  className="bg-surface-2 text-[13px] text-text placeholder:text-text-3 rounded-md px-3 py-2 border border-stroke focus:border-gold/40 focus:outline-none focus:ring-1 focus:ring-gold/20 transition-all duration-200"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-[family-name:var(--font-mono)] text-text-3 uppercase tracking-[0.15em]">
                  GitHub URL
                </label>
                <input
                  type="url"
                  defaultValue={project.github_repo_url ?? ""}
                  onChange={(e) => debouncedUpdate({ github_repo_url: e.target.value || null })}
                  placeholder="https://github.com/..."
                  className="bg-surface-2 text-[13px] text-text placeholder:text-text-3 rounded-md px-3 py-2 border border-stroke focus:border-gold/40 focus:outline-none focus:ring-1 focus:ring-gold/20 transition-all duration-200"
                />
              </div>
            </div>
          ) : (project.url || project.github_repo_url) ? (
            <div className="flex gap-3">
              {project.url && (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-[12px] font-[family-name:var(--font-mono)] text-col-done hover:text-col-done/80 transition-colors border border-col-done/30 bg-col-done/5 px-3 py-1.5 rounded-md"
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                  Live Site
                </a>
              )}
              {project.github_repo_url && (
                <a
                  href={project.github_repo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-[12px] font-[family-name:var(--font-mono)] text-text-2 hover:text-text transition-colors border border-stroke bg-surface-2 px-3 py-1.5 rounded-md"
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  GitHub
                </a>
              )}
            </div>
          ) : null}

          {/* Divider + Todos + Notes — owner only */}
          {isOwner && (
            <>
              <div className="glow-divider my-1" />
              <TodoList
                todos={todos.todos}
                onAdd={todos.addTodo}
                onToggle={todos.toggleTodo}
                onDelete={todos.deleteTodo}
              />
              <NoteEditor note={notes.note} onUpdate={notes.updateContent} />
            </>
          )}

          {/* Source Log — owner only */}
          {isOwner && project.source_log_path && (
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
        <div className="flex items-center justify-between px-6 py-4 border-t border-stroke">
          {isOwner ? (
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
          ) : (
            <div />
          )}
          <button
            onClick={async () => {
              const { exportProjectPdf } = await import("@/lib/exportPdf");
              exportProjectPdf(project);
            }}
            className="text-[11px] font-[family-name:var(--font-mono)] text-text-3 hover:text-text px-3 py-2 rounded-md border border-stroke hover:border-stroke-light transition-all duration-200 uppercase tracking-wider"
          >
            Export PDF
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

// ── Read-only tag list (public view) ──────────────────
function ReadOnlyTags({ label, tags }: { label: string; tags: string[] }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] font-[family-name:var(--font-mono)] text-text-3 uppercase tracking-[0.15em]">
        {label}
      </label>
      <div className="flex flex-wrap gap-1.5">
        {tags.map((tag) => (
          <span
            key={tag}
            className="text-[11px] font-[family-name:var(--font-mono)] px-2 py-1 rounded bg-surface-3 text-text-2 border border-stroke"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
