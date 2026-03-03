"use client";

import { useState } from "react";
import { TodoItem as TodoItemType } from "@/lib/types";
import TodoItem from "./TodoItem";

interface TodoListProps {
  todos: TodoItemType[];
  onAdd: (text: string) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function TodoList({
  todos,
  onAdd,
  onToggle,
  onDelete,
}: TodoListProps) {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    onAdd(text);
    setInput("");
  };

  const completedCount = todos.filter((t) => t.completed).length;

  return (
    <div className="flex flex-col gap-2">
      {/* Section header */}
      <div className="flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-gold">
            <rect x="1" y="1" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="1.2" />
            <path d="M3.5 6L5 7.5L8.5 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <h3 className="text-[11px] font-[family-name:var(--font-display)] font-semibold text-text-2 uppercase tracking-[0.15em]">
            Todos
          </h3>
        </div>
        {todos.length > 0 && (
          <span className="text-[10px] font-[family-name:var(--font-mono)] text-text-3 tabular-nums">
            {completedCount}/{todos.length}
          </span>
        )}
      </div>

      {/* Progress bar */}
      {todos.length > 0 && (
        <div className="mx-4 h-[2px] bg-surface-3 rounded-full overflow-hidden">
          <div
            className="h-full bg-gold/60 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${(completedCount / todos.length) * 100}%` }}
          />
        </div>
      )}

      {/* Add input */}
      <form onSubmit={handleSubmit} className="px-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a todo..."
          className="
            w-full bg-surface-2 text-[13px] text-text placeholder:text-text-3
            rounded-md px-3 py-2 border border-stroke
            focus:border-gold/40 focus:outline-none focus:ring-1 focus:ring-gold/20
            transition-all duration-200
          "
        />
      </form>

      {/* List */}
      <div className="flex flex-col max-h-64 overflow-y-auto">
        {todos.length === 0 && (
          <div className="flex flex-col items-center py-5 gap-2">
            <div className="w-7 h-7 rounded-md border border-stroke flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-text-3">
                <rect x="1" y="1" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
              </svg>
            </div>
            <p className="text-[11px] font-[family-name:var(--font-mono)] text-text-3">
              No todos yet
            </p>
          </div>
        )}
        <div className="stagger">
          {todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={onToggle}
              onDelete={onDelete}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
