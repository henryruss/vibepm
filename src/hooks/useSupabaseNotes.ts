"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { NoteData } from "@/lib/types";

export function useSupabaseNotes(projectId?: string) {
  const { user } = useAuth();
  const [note, setNote] = useState<NoteData>({
    id: "",
    user_id: "",
    project_id: null,
    content: "",
    updated_at: new Date().toISOString(),
  });
  const [loading, setLoading] = useState(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const supabase = createClient();

  useEffect(() => {
    if (!user) return;

    const fetchNote = async () => {
      let query = supabase.from("notes").select("*");

      if (projectId) {
        query = query.eq("project_id", projectId);
      } else {
        query = query.is("project_id", null);
      }

      const { data, error } = await query.limit(1).single();

      if (error && error.code === "PGRST116") {
        // No note exists yet, create one
        const insertData: Record<string, unknown> = { user_id: user.id, content: "" };
        if (projectId) insertData.project_id = projectId;

        const { data: newNote } = await supabase
          .from("notes")
          .insert(insertData)
          .select()
          .single();

        if (newNote) {
          setNote(newNote as NoteData);
        }
      } else if (data) {
        setNote(data as NoteData);
      }
      setLoading(false);
    };

    fetchNote();
  }, [user, supabase, projectId]);

  const persistNote = useCallback(
    async (content: string) => {
      if (!note.id) return;
      await supabase
        .from("notes")
        .update({ content })
        .eq("id", note.id);
    },
    [note.id, supabase]
  );

  const updateContent = useCallback(
    (content: string) => {
      setNote((prev) => ({
        ...prev,
        content,
        updated_at: new Date().toISOString(),
      }));

      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => persistNote(content), 500);
    },
    [persistNote]
  );

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return { note, updateContent, loading };
}
