"use client";

import { Project } from "@/lib/types";
import { getStatusLabel, getStatusColor, getStatusDot, getRelativeTime } from "@/lib/projectUtils";

interface PortfolioCardProps {
  project: Project;
  onClick: (id: string) => void;
}

export default function PortfolioCard({ project, onClick }: PortfolioCardProps) {
  const statusLabel = getStatusLabel(project);
  const statusColor = getStatusColor(project);
  const dotColor = getStatusDot(project);

  return (
    <button
      onClick={() => onClick(project.id)}
      className="group w-full text-left card-glass rounded-xl border border-stroke p-4 flex flex-col gap-3 transition-all duration-200 hover:border-stroke-light hover:shadow-sm card-glow cursor-pointer"
    >
      {/* Top row: title + status */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-[family-name:var(--font-display)] font-semibold text-[15px] text-text leading-tight line-clamp-2">
          {project.title}
        </h3>
        <span className={`shrink-0 flex items-center gap-1.5 text-[10px] font-[family-name:var(--font-mono)] uppercase tracking-wider px-2 py-0.5 rounded-full border ${statusColor}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
          {statusLabel}
        </span>
      </div>

      {/* Summary */}
      {project.summary && (
        <p className="text-[12px] text-text-2 leading-relaxed line-clamp-2">
          {project.summary}
        </p>
      )}

      {/* Tech stack pills */}
      {project.tech_stack.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {project.tech_stack.slice(0, 5).map((tech) => (
            <span
              key={tech}
              className="text-[10px] font-[family-name:var(--font-mono)] px-1.5 py-0.5 rounded bg-surface-3 text-text-3 border border-stroke"
            >
              {tech}
            </span>
          ))}
          {project.tech_stack.length > 5 && (
            <span className="text-[10px] font-[family-name:var(--font-mono)] px-1.5 py-0.5 text-text-3">
              +{project.tech_stack.length - 5}
            </span>
          )}
        </div>
      )}

      {/* Footer: links + timestamp */}
      <div className="flex items-center justify-between pt-1 border-t border-stroke/50">
        <div className="flex items-center gap-2">
          {project.github_repo_url && (
            <a
              href={project.github_repo_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-text-3 hover:text-text transition-colors"
              title="GitHub"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
              </svg>
            </a>
          )}
          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-text-3 hover:text-text transition-colors"
              title="Live site"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>
          )}
        </div>
        <span className="text-[10px] font-[family-name:var(--font-mono)] text-text-3">
          {getRelativeTime(project.updated_at)}
        </span>
      </div>
    </button>
  );
}
