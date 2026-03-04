"use client";

import { TodoItem as TodoItemType } from "@/lib/types";

interface TodoItemProps {
  todo: TodoItemType;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  return (
    <div className="group flex items-center gap-2.5 px-3 py-1.5 rounded-md hover:bg-surface-3/40 transition-all duration-200">
      <button
        onClick={() => onToggle(todo.id)}
        className={`
          w-[15px] h-[15px] rounded-[4px] border flex-shrink-0
          flex items-center justify-center transition-all duration-300
          ${todo.completed
            ? "bg-gold border-gold shadow-[0_0_6px_rgba(232,118,58,0.3)]"
            : "border-stroke-light hover:border-gold/50"
          }
        `}
      >
        {todo.completed && (
          <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
            <path
              d="M2 5.5L4 7.5L8 3"
              stroke="var(--color-void)"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>
      <span
        className={`text-[13px] flex-1 transition-all duration-300 ${
          todo.completed
            ? "text-text-3 line-through decoration-text-3/40"
            : "text-text"
        }`}
      >
        {todo.text}
      </span>
      <button
        onClick={() => onDelete(todo.id)}
        className="
          opacity-0 group-hover:opacity-100 text-text-3 hover:text-danger
          transition-all duration-200 w-5 h-5 rounded flex items-center justify-center
          hover:bg-danger/10
        "
      >
        <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
          <path d="M2 2L8 8M8 2L2 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}
