"use client";

import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useProjects } from "@/hooks/useProjects";
import { useSupabaseTodos } from "@/hooks/useSupabaseTodos";
import { useSupabaseNotes } from "@/hooks/useSupabaseNotes";
import KanbanBoard from "./kanban/KanbanBoard";
import TodoList from "./todos/TodoList";
import NoteEditor from "./notes/NoteEditor";
import ProjectDetailView from "./projects/ProjectDetailView";

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const projects = useProjects();
  const todos = useSupabaseTodos();
  const notes = useSupabaseNotes();
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const selectedProject = selectedProjectId
    ? projects.projects.find((p) => p.id === selectedProjectId) ?? null
    : null;

  const isConnected = !projects.error;

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
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div
              className={`w-1.5 h-1.5 rounded-full ${
                isConnected ? "bg-col-done animate-glow-pulse" : "bg-danger"
              }`}
            />
            <span className="text-[10px] font-[family-name:var(--font-mono)] text-text-3">
              {isConnected ? "connected" : "offline"}
            </span>
          </div>
          {user && (
            <button
              onClick={signOut}
              className="text-[10px] font-[family-name:var(--font-mono)] text-text-3 hover:text-text-2 transition-colors uppercase tracking-wider"
            >
              Sign out
            </button>
          )}
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
          {projects.loading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <div className="w-6 h-6 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
                <p className="text-text-3 text-xs font-[family-name:var(--font-mono)] tracking-wider uppercase">
                  Loading projects
                </p>
              </div>
            </div>
          ) : (
            <KanbanBoard
              cards={projects.cards}
              getColumnCards={projects.getColumnCards}
              onAddCard={projects.addCard}
              onDeleteCard={projects.deleteCard}
              onMoveCard={projects.moveCard}
              onCardClick={setSelectedProjectId}
            />
          )}
        </main>
      </div>

      {/* ── Project Detail Slide-out ──────────── */}
      {selectedProject && (
        <ProjectDetailView
          project={selectedProject}
          onUpdate={projects.updateProject}
          onDelete={projects.deleteProject}
          onClose={() => setSelectedProjectId(null)}
        />
      )}
    </div>
  );
}
