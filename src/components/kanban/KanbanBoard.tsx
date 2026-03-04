"use client";

import { useState, useCallback } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import { Project, ProjectStage } from "@/lib/types";
import KanbanColumn from "./KanbanColumn";
import KanbanCard from "./KanbanCard";
import PanoramaSVG from "../landscape/PanoramaSVG";

const COLUMNS: ProjectStage[] = ["idea", "planned", "in-progress", "complete"];

interface KanbanBoardProps {
  cards: Project[];
  getColumnCards: (stage: ProjectStage) => Project[];
  onAddCard: (title: string, stage: ProjectStage, description?: string) => void;
  onDeleteCard: (id: string) => void;
  onMoveCard: (cardId: string, targetStage: ProjectStage, targetIndex: number) => void;
  onCardClick?: (id: string) => void;
}

export default function KanbanBoard({
  cards,
  getColumnCards,
  onAddCard,
  onDeleteCard,
  onMoveCard,
  onCardClick,
}: KanbanBoardProps) {
  const [activeCard, setActiveCard] = useState<Project | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const findColumnOfCard = useCallback(
    (cardId: string): ProjectStage | null => {
      const card = cards.find((c) => c.id === cardId);
      return card ? card.stage : null;
    },
    [cards]
  );

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const card = cards.find((c) => c.id === event.active.id);
      if (card) setActiveCard(card);
    },
    [cards]
  );

  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
      const { active, over } = event;
      if (!over) return;

      const activeId = active.id as string;
      const overId = over.id as string;

      const activeColumn = findColumnOfCard(activeId);
      const overColumn = COLUMNS.includes(overId as ProjectStage)
        ? (overId as ProjectStage)
        : findColumnOfCard(overId);

      if (!activeColumn || !overColumn || activeColumn === overColumn) return;

      const overCards = getColumnCards(overColumn);
      const overIndex = overCards.findIndex((c) => c.id === overId);
      const targetIndex = overIndex >= 0 ? overIndex : overCards.length;

      onMoveCard(activeId, overColumn, targetIndex);
    },
    [findColumnOfCard, getColumnCards, onMoveCard]
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveCard(null);

      if (!over) return;

      const activeId = active.id as string;
      const overId = over.id as string;

      const activeColumn = findColumnOfCard(activeId);
      const overColumn = COLUMNS.includes(overId as ProjectStage)
        ? (overId as ProjectStage)
        : findColumnOfCard(overId);

      if (!activeColumn || !overColumn) return;
      if (activeId === overId) return;

      const overCards = getColumnCards(overColumn);
      const overIndex = overCards.findIndex((c) => c.id === overId);
      const targetIndex = overIndex >= 0 ? overIndex : overCards.length;

      onMoveCard(activeId, overColumn, targetIndex);
    },
    [findColumnOfCard, getColumnCards, onMoveCard]
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="relative flex-1 overflow-hidden">
        {/* Panorama landscape layer */}
        <div className="panorama-layer absolute bottom-0 left-0 right-0 h-[45vh] z-0 pointer-events-none">
          <PanoramaSVG />
        </div>

        {/* Columns grid */}
        <div className="relative z-10 grid grid-cols-4 gap-3 h-full p-4 stagger">
          {COLUMNS.map((stage) => (
            <KanbanColumn
              key={stage}
              columnId={stage}
              cards={getColumnCards(stage)}
              onAddCard={onAddCard}
              onDeleteCard={onDeleteCard}
              onCardClick={onCardClick}
            />
          ))}
        </div>
      </div>
      <DragOverlay dropAnimation={null}>
        {activeCard ? (
          <KanbanCard card={activeCard} onDelete={() => {}} isDragOverlay />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
