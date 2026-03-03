"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { TodoItem } from "@/lib/types";

export function useSupabaseTodos() {
  const { user } = useAuth();
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    if (!user) return;

    const fetchTodos = async () => {
      const { data, error } = await supabase
        .from("todos")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setTodos(data as TodoItem[]);
      }
      setLoading(false);
    };

    fetchTodos();
  }, [user, supabase]);

  const addTodo = useCallback(
    async (text: string) => {
      if (!user) return;

      const optimistic: TodoItem = {
        id: crypto.randomUUID(),
        user_id: user.id,
        text,
        completed: false,
        created_at: new Date().toISOString(),
      };

      setTodos((prev) => [optimistic, ...prev]);

      const { data, error } = await supabase
        .from("todos")
        .insert({ user_id: user.id, text })
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
    [user, supabase]
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
