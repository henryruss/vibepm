export type ProjectStage = "idea" | "planned" | "in-progress" | "complete";

/** @deprecated Use ProjectStage instead */
export type ColumnId = ProjectStage;

export interface Project {
  id: string;
  user_id: string;
  title: string;
  description: string;
  stage: ProjectStage;
  order: number;
  summary: string;
  tech_stack: string[];
  files_built: string[];
  key_decisions: string[];
  lessons_learned: string[];
  source_log_path: string | null;
  url: string | null;
  created_at: string;
  updated_at: string;
}

/** @deprecated Use Project instead */
export type KanbanCard = Project;

export interface TodoItem {
  id: string;
  user_id: string;
  text: string;
  completed: boolean;
  created_at: string;
}

export interface NoteData {
  id: string;
  user_id: string;
  content: string;
  updated_at: string;
}
