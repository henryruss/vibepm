"use client";

import React from "react";
import { Project, ProjectCategory } from "@/lib/types";
import PortfolioCard from "./PortfolioCard";
import { isDeployed } from "@/lib/projectUtils";

interface PortfolioGridProps {
  projects: Project[];
  onCardClick: (id: string) => void;
  onAddProject: (category: ProjectCategory) => void;
}

const CATEGORIES: { key: ProjectCategory; label: string; icon: React.ReactNode }[] = [
  {
    key: "website",
    label: "Websites & Webapps",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cat-website">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  },
  {
    key: "agent",
    label: "Agents",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cat-agent">
        <path d="M12 2a4 4 0 0 1 4 4v2a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4z" />
        <path d="M6 10v1a6 6 0 0 0 12 0v-1" />
        <line x1="12" y1="17" x2="12" y2="22" />
        <line x1="8" y1="22" x2="16" y2="22" />
      </svg>
    ),
  },
];

export default function PortfolioGrid({ projects, onCardClick, onAddProject }: PortfolioGridProps) {
  return (
    <div className="flex-1 overflow-y-auto px-6 py-6 animate-view-fade">
      <div className="max-w-6xl mx-auto flex flex-col gap-10">
        {CATEGORIES.map(({ key, label, icon }) => {
          const catProjects = projects.filter((p) => p.category === key);
          const deployedCount = catProjects.filter(isDeployed).length;

          return (
            <section key={key}>
              {/* Category header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  {icon}
                  <h2 className="font-[family-name:var(--font-display)] font-bold text-base text-text">
                    {label}
                  </h2>
                  <span className="text-[10px] font-[family-name:var(--font-mono)] text-text-3 bg-surface-3 px-1.5 py-0.5 rounded-full">
                    {catProjects.length}
                  </span>
                  {deployedCount > 0 && (
                    <span className="text-[10px] font-[family-name:var(--font-mono)] text-col-done bg-col-done/10 px-1.5 py-0.5 rounded-full">
                      {deployedCount} live
                    </span>
                  )}
                </div>
                <button
                  onClick={() => onAddProject(key)}
                  className="flex items-center gap-1.5 text-[11px] font-[family-name:var(--font-mono)] text-text-3 hover:text-text px-2.5 py-1.5 rounded-md border border-stroke hover:border-stroke-light transition-all duration-200 uppercase tracking-wider"
                >
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M5 1V9M1 5H9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                  </svg>
                  Add
                </button>
              </div>

              {/* Grid */}
              {catProjects.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 stagger">
                  {catProjects.map((project) => (
                    <PortfolioCard
                      key={project.id}
                      project={project}
                      onClick={onCardClick}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center py-8 rounded-xl border border-dashed border-stroke">
                  <p className="text-[12px] font-[family-name:var(--font-mono)] text-text-3">
                    No {label.toLowerCase()} yet
                  </p>
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
