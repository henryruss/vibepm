"use client";

import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { ProjectStage, Project } from "@/lib/types";
import KanbanCard from "./KanbanCard";
import AddCardForm from "./AddCardForm";

const COLUMN_CONFIG: Record<
  ProjectStage,
  { label: string; color: string; bgGlow: string }
> = {
  idea: {
    label: "Idea",
    color: "bg-col-idea",
    bgGlow: "rgba(168, 130, 255, 0.08)",
  },
  planned: {
    label: "Planned",
    color: "bg-col-todo",
    bgGlow: "rgba(124, 131, 247, 0.08)",
  },
  "in-progress": {
    label: "In Progress",
    color: "bg-col-progress",
    bgGlow: "rgba(245, 166, 35, 0.06)",
  },
  complete: {
    label: "Complete",
    color: "bg-col-done",
    bgGlow: "rgba(62, 207, 142, 0.06)",
  },
};

interface KanbanColumnProps {
  columnId: ProjectStage;
  cards: Project[];
  onAddCard: (title: string, stage: ProjectStage, description?: string) => void;
  onDeleteCard: (id: string) => void;
  onCardClick?: (id: string) => void;
}

export default function KanbanColumn({
  columnId,
  cards,
  onAddCard,
  onDeleteCard,
  onCardClick,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: columnId });
  const config = COLUMN_CONFIG[columnId];

  return (
    <div
      className={`flex flex-col rounded-lg min-w-[252px] w-[280px] flex-shrink-0 transition-all duration-300 overflow-hidden ${
        isOver ? "ring-1 ring-gold/20" : ""
      }`}
      style={{
        background: isOver
          ? config.bgGlow
          : "var(--color-surface-1)",
        border: "1px solid var(--color-stroke)",
      }}
    >
      {/* Colored top strip */}
      <div className={`h-[2px] ${config.color}`} />

      {/* Header */}
      <div className="flex items-center gap-2.5 px-3.5 py-3">
        <div className={`w-1.5 h-1.5 rounded-full ${config.color}`} />
        <h2 className="text-[13px] font-[family-name:var(--font-display)] font-semibold text-text tracking-wide">
          {config.label}
        </h2>
        <span className="ml-auto text-[11px] font-[family-name:var(--font-mono)] text-text-3 tabular-nums">
          {cards.length}
        </span>
      </div>

      {/* Card list */}
      <div
        ref={setNodeRef}
        className="flex flex-col gap-2 px-2.5 pb-2.5 flex-1 min-h-[60px]"
      >
        <SortableContext
          items={cards.map((c) => c.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="flex flex-col gap-1.5 stagger">
            {cards.map((card) => (
              <KanbanCard
                key={card.id}
                card={card}
                onDelete={onDeleteCard}
                onClick={onCardClick}
              />
            ))}
          </div>
        </SortableContext>

        {cards.length === 0 && (
          <div className="flex flex-col items-center justify-center py-6 gap-2">
            <div className="w-8 h-8 rounded-lg border border-stroke flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-text-3">
                <rect x="1" y="1" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
              </svg>
            </div>
            <p className="text-[11px] font-[family-name:var(--font-mono)] text-text-3">
              No cards yet
            </p>
          </div>
        )}

        <AddCardForm columnId={columnId} onAdd={onAddCard} />
      </div>
    </div>
  );
}
