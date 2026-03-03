"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { NoteData } from "@/lib/types";

export function useSupabaseNotes() {
  const { user } = useAuth();
  const [note, setNote] = useState<NoteData>({
    id: "",
    user_id: "",
    content: "",
    updated_at: new Date().toISOString(),
  });
  const [loading, setLoading] = useState(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const supabase = createClient();

  useEffect(() => {
    if (!user) return;

    const fetchNote = async () => {
      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .limit(1)
        .single();

      if (error && error.code === "PGRST116") {
        // No note exists yet, create one
        const { data: newNote } = await supabase
          .from("notes")
          .insert({ user_id: user.id, content: "" })
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
  }, [user, supabase]);

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

      // Debounce save to Supabase (500ms)
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
