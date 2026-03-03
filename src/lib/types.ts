export type ColumnId = "todo" | "in-progress" | "complete";

export interface KanbanCard {
  id: string;
  title: string;
  description: string;
  columnId: ColumnId;
  order: number;
  createdAt: string;
}

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
}

export interface NoteData {
  id: string;
  content: string;
  updatedAt: string;
}
