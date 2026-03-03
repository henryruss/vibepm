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
import { KanbanCard as KanbanCardType, ColumnId } from "@/lib/types";
import KanbanColumn from "./KanbanColumn";
import KanbanCard from "./KanbanCard";

const COLUMNS: ColumnId[] = ["todo", "in-progress", "complete"];

interface KanbanBoardProps {
  cards: KanbanCardType[];
  getColumnCards: (columnId: ColumnId) => KanbanCardType[];
  onAddCard: (title: string, columnId: ColumnId) => void;
  onDeleteCard: (id: string) => void;
  onMoveCard: (cardId: string, targetColumnId: ColumnId, targetIndex: number) => void;
}

export default function KanbanBoard({
  cards,
  getColumnCards,
  onAddCard,
  onDeleteCard,
  onMoveCard,
}: KanbanBoardProps) {
  const [activeCard, setActiveCard] = useState<KanbanCardType | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const findColumnOfCard = useCallback(
    (cardId: string): ColumnId | null => {
      const card = cards.find((c) => c.id === cardId);
      return card ? card.columnId : null;
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
      const overColumn = COLUMNS.includes(overId as ColumnId)
        ? (overId as ColumnId)
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
      const overColumn = COLUMNS.includes(overId as ColumnId)
        ? (overId as ColumnId)
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
      <div className="flex gap-4 flex-1 overflow-x-auto p-5 stagger">
        {COLUMNS.map((columnId) => (
          <KanbanColumn
            key={columnId}
            columnId={columnId}
            cards={getColumnCards(columnId)}
            onAddCard={onAddCard}
            onDeleteCard={onDeleteCard}
          />
        ))}
      </div>
      <DragOverlay dropAnimation={null}>
        {activeCard ? (
          <KanbanCard card={activeCard} onDelete={() => {}} isDragOverlay />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
