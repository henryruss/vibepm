export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string;
          stage: "idea" | "planned" | "in-progress" | "complete";
          order: number;
          summary: string;
          tech_stack: string[];
          files_built: Json;
          key_decisions: string[];
          lessons_learned: string[];
          source_log_path: string | null;
          url: string | null;
          github_repo_url: string | null;
          content_hash: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description?: string;
          stage?: "idea" | "planned" | "in-progress" | "complete";
          order?: number;
          summary?: string;
          tech_stack?: string[];
          files_built?: Json;
          key_decisions?: string[];
          lessons_learned?: string[];
          source_log_path?: string | null;
          url?: string | null;
          github_repo_url?: string | null;
          content_hash?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string;
          stage?: "idea" | "planned" | "in-progress" | "complete";
          order?: number;
          summary?: string;
          tech_stack?: string[];
          files_built?: Json;
          key_decisions?: string[];
          lessons_learned?: string[];
          source_log_path?: string | null;
          url?: string | null;
          github_repo_url?: string | null;
          content_hash?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      todos: {
        Row: {
          id: string;
          user_id: string;
          text: string;
          completed: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          text: string;
          completed?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          text?: string;
          completed?: boolean;
          created_at?: string;
        };
      };
      notes: {
        Row: {
          id: string;
          user_id: string;
          content: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          content?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          content?: string;
          updated_at?: string;
        };
      };
    };
  };
}
