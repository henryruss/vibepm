"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { TodoItem } from "@/lib/types";

export function useSupabaseTodos(projectId?: string) {
  const { user } = useAuth();
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    if (!user) return;

    const fetchTodos = async () => {
      let query = supabase
        .from("todos")
        .select("*")
        .order("created_at", { ascending: false });

      if (projectId) {
        query = query.eq("project_id", projectId);
      } else {
        query = query.is("project_id", null);
      }

      const { data, error } = await query;

      if (!error && data) {
        setTodos(data as TodoItem[]);
      }
      setLoading(false);
    };

    fetchTodos();
  }, [user, supabase, projectId]);

  const addTodo = useCallback(
    async (text: string) => {
      if (!user) return;

      const optimistic: TodoItem = {
        id: crypto.randomUUID(),
        user_id: user.id,
        project_id: projectId ?? null,
        text,
        completed: false,
        created_at: new Date().toISOString(),
      };

      setTodos((prev) => [optimistic, ...prev]);

      const insertData: Record<string, unknown> = { user_id: user.id, text };
      if (projectId) insertData.project_id = projectId;

      const { data, error } = await supabase
        .from("todos")
        .insert(insertData)
        .select()
        .single();

      if (error) {
        setTodos((prev) => prev.filter((t) => t.id !== optimistic.id));
      } else {
        setTodos((prev) =>
          prev.map((t) => (t.id === optimistic.id ? (data as TodoItem) : t))
        );
      }
    },
    [user, supabase, projectId]
  );

  const toggleTodo = useCallback(
    async (id: string) => {
      const todo = todos.find((t) => t.id === id);
      if (!todo) return;

      const newCompleted = !todo.completed;
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? { ...t, completed: newCompleted } : t))
      );

      await supabase
        .from("todos")
        .update({ completed: newCompleted })
        .eq("id", id);
    },
    [todos, supabase]
  );

  const deleteTodo = useCallback(
    async (id: string) => {
      const prev = todos;
      setTodos((t) => t.filter((todo) => todo.id !== id));

      const { error } = await supabase.from("todos").delete().eq("id", id);

      if (error) {
        setTodos(prev);
      }
    },
    [todos, supabase]
  );

  return { todos, addTodo, toggleTodo, deleteTodo, loading };
}
