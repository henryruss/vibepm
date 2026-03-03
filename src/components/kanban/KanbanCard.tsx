"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { KanbanCard as KanbanCardType } from "@/lib/types";

interface KanbanCardProps {
  card: KanbanCardType;
  onDelete: (id: string) => void;
  isDragOverlay?: boolean;
}

export default function KanbanCard({
  card,
  onDelete,
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

  return (
    <div
      ref={!isDragOverlay ? setNodeRef : undefined}
      style={baseStyle}
      {...(!isDragOverlay ? attributes : {})}
      {...(!isDragOverlay ? listeners : {})}
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
        {!isDragOverlay && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(card.id);
            }}
            className="opacity-0 group-hover:opacity-100 text-text-3 hover:text-danger transition-all duration-200 flex-shrink-0 mt-0.5 w-5 h-5 flex items-center justify-center rounded hover:bg-danger/10"
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M2 2L8 8M8 2L2 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </div>
      {card.description && (
        <p className="text-[11px] text-text-3 mt-1.5 leading-relaxed">
          {card.description}
        </p>
      )}
    </div>
  );
}
