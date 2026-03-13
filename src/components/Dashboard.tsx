"use client";

import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useProjects } from "@/hooks/useProjects";
import { ProjectCategory } from "@/lib/types";
import KanbanBoard from "./kanban/KanbanBoard";
import PortfolioGrid from "./portfolio/PortfolioGrid";
import ProjectDetailView from "./projects/ProjectDetailView";
import AddProjectModal from "./portfolio/AddProjectModal";

type ViewMode = "portfolio" | "pipeline";

interface DashboardProps {
  isOwner: boolean;
}

export default function Dashboard({ isOwner }: DashboardProps) {
  const { user, signOut } = useAuth();
  const projects = useProjects();
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [view, setView] = useState<ViewMode>("portfolio");
  const [addModalCategory, setAddModalCategory] = useState<ProjectCategory | null>(null);

  const selectedProject = selectedProjectId
    ? projects.projects.find((p) => p.id === selectedProjectId) ?? null
    : null;

  const isConnected = !projects.error;
  const activeView = isOwner ? view : "portfolio";

  return (
    <div className="h-screen flex flex-col overflow-hidden animate-fade-up">
      {/* ── Header ──────────────────────────────── */}
      <header className="flex items-center justify-between px-5 h-12 border-b border-stroke bg-surface-0/80 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <h1 className="font-[family-name:var(--font-display)] text-lg font-bold tracking-tight">
            {isOwner ? (
              <>
                <span className="text-gold">vibe</span>
                <span className="text-text">pm</span>
              </>
            ) : (
              <span className="text-text">Henry Russell</span>
            )}
          </h1>
          <div className="w-px h-4 bg-stroke-light" />
          <span className="text-[10px] font-[family-name:var(--font-mono)] text-text-3 uppercase tracking-[0.2em]">
            {isOwner ? "ai project portfolio" : "software & ai projects"}
          </span>
        </div>

        <div className="flex items-center gap-4">
          {/* Export portfolio */}
          <button
            onClick={async () => {
              const { exportPortfolioPdf } = await import("@/lib/exportPdf");
              exportPortfolioPdf(projects.projects);
            }}
            className="text-[10px] font-[family-name:var(--font-mono)] text-text-3 hover:text-text-2 transition-colors uppercase tracking-wider"
          >
            Export PDF
          </button>

          {/* View toggle — owner only */}
          {isOwner && (
            <div className="flex items-center bg-surface-2 rounded-md border border-stroke p-0.5">
              <button
                onClick={() => setView("portfolio")}
                className={`text-[10px] font-[family-name:var(--font-mono)] uppercase tracking-wider px-2.5 py-1 rounded transition-all duration-200 ${
                  view === "portfolio"
                    ? "bg-surface-0 text-text shadow-sm"
                    : "text-text-3 hover:text-text-2"
                }`}
              >
                Portfolio
              </button>
              <button
                onClick={() => setView("pipeline")}
                className={`text-[10px] font-[family-name:var(--font-mono)] uppercase tracking-wider px-2.5 py-1 rounded transition-all duration-200 ${
                  view === "pipeline"
                    ? "bg-surface-0 text-text shadow-sm"
                    : "text-text-3 hover:text-text-2"
                }`}
              >
                Pipeline
              </button>
            </div>
          )}

          {/* Connection status — owner only */}
          {isOwner && (
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
          )}

          {/* Auth: sign out for owner, subtle login link for guests */}
          {isOwner && user ? (
            <button
              onClick={signOut}
              className="text-[10px] font-[family-name:var(--font-mono)] text-text-3 hover:text-text-2 transition-colors uppercase tracking-wider"
            >
              Sign out
            </button>
          ) : !isOwner ? (
            <a
              href="/login"
              title="Owner login"
              className="text-text-3/40 hover:text-text-3 transition-colors"
            >
              🔒
            </a>
          ) : null}
        </div>
      </header>

      {/* ── Main ─────────────────────────────── */}
      <main className="flex-1 overflow-hidden flex flex-col">
        {projects.loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-6 h-6 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
              <p className="text-text-3 text-xs font-[family-name:var(--font-mono)] tracking-wider uppercase">
                Loading projects
              </p>
            </div>
          </div>
        ) : activeView === "portfolio" ? (
          <PortfolioGrid
            projects={projects.projects}
            onCardClick={setSelectedProjectId}
            onAddProject={(cat) => setAddModalCategory(cat)}
            isOwner={isOwner}
          />
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

      {/* ── Project Detail Panel ──────────── */}
      {selectedProject && (
        <ProjectDetailView
          project={selectedProject}
          onUpdate={projects.updateProject}
          onDelete={projects.deleteProject}
          onClose={() => setSelectedProjectId(null)}
          isOwner={isOwner}
        />
      )}

      {/* ── Add Project Modal — owner only ──── */}
      {isOwner && addModalCategory !== null && (
        <AddProjectModal
          defaultCategory={addModalCategory}
          onAdd={projects.addProject}
          onClose={() => setAddModalCategory(null)}
        />
      )}
    </div>
  );
}
