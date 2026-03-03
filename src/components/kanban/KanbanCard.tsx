"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Project } from "@/lib/types";

interface KanbanCardProps {
  card: Project;
  onDelete: (id: string) => void;
  onClick?: (id: string) => void;
  isDragOverlay?: boolean;
}

export default function KanbanCard({
  card,
  onDelete,
  onClick,
  isDragOverlay,
}: KanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id });

  const baseStyle = !isDragOverlay
    ? {
        transform: CSS.Transform.toString(transform),
        transition,
        background: "var(--color-surface-2)",
        border: "1px solid var(--color-stroke)",
      }
    : {
        background: "var(--color-surface-3)",
        border: "1px solid rgba(245, 166, 35, 0.2)",
      };

  const handleClick = () => {
    if (!isDragOverlay && onClick) {
      onClick(card.id);
    }
  };

  return (
    <div
      ref={!isDragOverlay ? setNodeRef : undefined}
      style={baseStyle}
      {...(!isDragOverlay ? attributes : {})}
      {...(!isDragOverlay ? listeners : {})}
      onClick={handleClick}
      className={`
        group card-glow rounded-md px-3 py-2.5 cursor-grab active:cursor-grabbing
        transition-all duration-200
        ${isDragging ? "opacity-30 scale-[0.98]" : ""}
        ${isDragOverlay
          ? "shadow-2xl shadow-black/50 ring-1 ring-gold/30 scale-[1.02]"
          : "hover:translate-y-[-1px]"
        }
      `}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-[13px] text-text leading-snug font-medium">{card.title}</p>
        <div className="flex items-center gap-1 flex-shrink-0 mt-0.5">
          {card.source_log_path && (
            <span className="text-text-3" title="Imported from log">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M1 5H6M6 5L4 3M6 5L4 7M8 1V9" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          )}
          {card.url && (
            <a
              href={card.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-text-3 hover:text-gold transition-colors"
              title={card.url}
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M7 3L3 7M7 3V6M7 3H4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          )}
          {!isDragOverlay && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(card.id);
              }}
              className="opacity-0 group-hover:opacity-100 text-text-3 hover:text-danger transition-all duration-200 w-5 h-5 flex items-center justify-center rounded hover:bg-danger/10"
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M2 2L8 8M8 2L2 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          )}
        </div>
      </div>
      {card.description && (
        <p className="text-[11px] text-text-3 mt-1.5 leading-relaxed line-clamp-2">
          {card.description}
        </p>
      )}
      {card.tech_stack && card.tech_stack.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {card.tech_stack.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="text-[9px] font-[family-name:var(--font-mono)] px-1.5 py-0.5 rounded bg-surface-4/80 text-text-3 border border-stroke"
            >
              {tech}
            </span>
          ))}
          {card.tech_stack.length > 4 && (
            <span className="text-[9px] font-[family-name:var(--font-mono)] text-text-3">
              +{card.tech_stack.length - 4}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
