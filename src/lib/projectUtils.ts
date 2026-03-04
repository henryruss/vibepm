import { Project } from "./types";

export function isDeployed(project: Project): boolean {
  return project.stage === "complete" && !!project.url;
}

export type StatusLabel = "Live" | "In Progress" | "Planned" | "Idea";

export function getStatusLabel(project: Project): StatusLabel {
  if (isDeployed(project)) return "Live";
  if (project.stage === "in-progress") return "In Progress";
  if (project.stage === "planned") return "Planned";
  return "Idea";
}

export function getStatusColor(project: Project): string {
  const label = getStatusLabel(project);
  switch (label) {
    case "Live":
      return "text-col-done bg-col-done/10 border-col-done/30";
    case "In Progress":
      return "text-col-progress bg-col-progress/10 border-col-progress/30";
    case "Planned":
      return "text-col-todo bg-col-todo/10 border-col-todo/30";
    case "Idea":
      return "text-col-idea bg-col-idea/10 border-col-idea/30";
  }
}

export function getStatusDot(project: Project): string {
  const label = getStatusLabel(project);
  switch (label) {
    case "Live":
      return "bg-col-done";
    case "In Progress":
      return "bg-col-progress";
    case "Planned":
      return "bg-col-todo";
    case "Idea":
      return "bg-col-idea";
  }
}

export function getRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`;
  return `${Math.floor(diffDays / 365)}y ago`;
}
