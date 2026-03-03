"use client";

import { useCallback, useRef, useEffect } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { NoteData } from "@/lib/types";
import { generateId } from "@/utils/id";

const DEFAULT_NOTE: NoteData = {
  id: generateId(),
  content: "",
  updatedAt: new Date().toISOString(),
};

export function useNotes() {
  const [note, setNote, hydrated] = useLocalStorage<NoteData>(
    "vibepm-notes",
    DEFAULT_NOTE
  );
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const updateContent = useCallback(
    (content: string) => {
      setNote((prev) => ({ ...prev, content, updatedAt: new Date().toISOString() }));
    },
    [setNote]
  );

  const debouncedUpdate = useCallback(
    (content: string) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => updateContent(content), 300);
    },
    [updateContent]
  );

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return { note, updateContent: debouncedUpdate, hydrated };
}
