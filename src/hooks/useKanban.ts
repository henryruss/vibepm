"use client";

import { useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { KanbanCard, ColumnId } from "@/lib/types";
import { generateId } from "@/utils/id";

export function useKanban() {
  const [cards, setCards, hydrated] = useLocalStorage<KanbanCard[]>(
    "vibepm-kanban",
    []
  );

  const addCard = useCallback(
    (title: string, columnId: ColumnId, description: string = "") => {
      const columnCards = cards.filter((c) => c.columnId === columnId);
      const maxOrder = columnCards.reduce(
        (max, c) => Math.max(max, c.order),
        -1
      );
      const newCard: KanbanCard = {
        id: generateId(),
        title,
        description,
        columnId,
        order: maxOrder + 1,
        createdAt: new Date().toISOString(),
      };
      setCards((prev) => [...prev, newCard]);
    },
    [cards, setCards]
  );

  const deleteCard = useCallback(
    (id: string) => {
      setCards((prev) => prev.filter((c) => c.id !== id));
    },
    [setCards]
  );

  const updateCard = useCallback(
    (id: string, updates: Partial<Pick<KanbanCard, "title" | "description">>) => {
      setCards((prev) =>
        prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
      );
    },
    [setCards]
  );

  const moveCard = useCallback(
    (cardId: string, targetColumnId: ColumnId, targetIndex: number) => {
      setCards((prev) => {
        const card = prev.find((c) => c.id === cardId);
        if (!card) return prev;

        const otherCards = prev.filter((c) => c.id !== cardId);
        const targetColumnCards = otherCards
          .filter((c) => c.columnId === targetColumnId)
          .sort((a, b) => a.order - b.order);

        targetColumnCards.splice(targetIndex, 0, {
          ...card,
          columnId: targetColumnId,
        });

        const reorderedTarget = targetColumnCards.map((c, i) => ({
          ...c,
          order: i,
        }));

        const remainingCards = otherCards.filter(
          (c) => c.columnId !== targetColumnId
        );

        return [...remainingCards, ...reorderedTarget];
      });
    },
    [setCards]
  );

  const getColumnCards = useCallback(
    (columnId: ColumnId) => {
      return cards
        .filter((c) => c.columnId === columnId)
        .sort((a, b) => a.order - b.order);
    },
    [cards]
  );

  return { cards, addCard, deleteCard, updateCard, moveCard, getColumnCards, hydrated };
}
