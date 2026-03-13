"use client";

import { useAuth } from "@/components/AuthProvider";
import Dashboard from "@/components/Dashboard";

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-6 h-6 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
          <p className="text-text-3 text-xs font-[family-name:var(--font-mono)] tracking-wider uppercase">
            Loading workspace
          </p>
        </div>
      </div>
    );
  }

  return <Dashboard isOwner={!!user} />;
}
