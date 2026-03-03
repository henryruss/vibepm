"use client";

import { useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { TodoItem } from "@/lib/types";
import { generateId } from "@/utils/id";

export function useTodos() {
  const [todos, setTodos, hydrated] = useLocalStorage<TodoItem[]>(
    "vibepm-todos",
    []
  );

  const addTodo = useCallback(
    (text: string) => {
      const newTodo: TodoItem = {
        id: generateId(),
        text,
        completed: false,
        createdAt: new Date().toISOString(),
      };
      setTodos((prev) => [newTodo, ...prev]);
    },
    [setTodos]
  );

  const toggleTodo = useCallback(
    (id: string) => {
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
      );
    },
    [setTodos]
  );

  const deleteTodo = useCallback(
    (id: string) => {
      setTodos((prev) => prev.filter((t) => t.id !== id));
    },
    [setTodos]
  );

  return { todos, addTodo, toggleTodo, deleteTodo, hydrated };
}
