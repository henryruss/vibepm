"use client";

import { useState, useEffect } from "react";
import { useKanban } from "@/hooks/useKanban";
import { useTodos } from "@/hooks/useTodos";
import { useNotes } from "@/hooks/useNotes";
import KanbanBoard from "./kanban/KanbanBoard";
import TodoList from "./todos/TodoList";
import NoteEditor from "./notes/NoteEditor";

export default function Dashboard() {
  const [mounted, setMounted] = useState(false);
  const kanban = useKanban();
  const todos = useTodos();
  const notes = useNotes();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-6 h-6 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
          <p className="text-text-3 text-xs font-[family-name:var(--font-mono)] tracking-wider uppercase">
            Loading workspace
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden animate-fade-up">
      {/* ── Header ──────────────────────────────── */}
      <header className="flex items-center justify-between px-5 h-12 border-b border-stroke bg-surface-0/80 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <h1 className="font-[family-name:var(--font-display)] text-lg font-bold tracking-tight">
            <span className="text-gold">vibe</span>
            <span className="text-text">pm</span>
          </h1>
          <div className="w-px h-4 bg-stroke-light" />
          <span className="text-[10px] font-[family-name:var(--font-mono)] text-text-3 uppercase tracking-[0.2em]">
            workspace
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-col-done animate-glow-pulse" />
          <span className="text-[10px] font-[family-name:var(--font-mono)] text-text-3">
            auto-saved
          </span>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* ── Sidebar ──────────────────────────── */}
        <aside className="w-80 flex-shrink-0 bg-surface-0/50 backdrop-blur-sm flex flex-col overflow-hidden border-r border-stroke">
          <div className="flex-1 overflow-y-auto py-4 flex flex-col gap-1">
            <TodoList
              todos={todos.todos}
              onAdd={todos.addTodo}
              onToggle={todos.toggleTodo}
              onDelete={todos.deleteTodo}
            />
            <div className="glow-divider mx-4 my-3" />
            <NoteEditor note={notes.note} onUpdate={notes.updateContent} />
          </div>
        </aside>

        {/* ── Main ─────────────────────────────── */}
        <main className="flex-1 overflow-hidden flex flex-col bg-void-soft">
          <KanbanBoard
            cards={kanban.cards}
            getColumnCards={kanban.getColumnCards}
            onAddCard={kanban.addCard}
            onDeleteCard={kanban.deleteCard}
            onMoveCard={kanban.moveCard}
          />
        </main>
      </div>
    </div>
  );
}
