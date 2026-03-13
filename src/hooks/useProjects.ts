"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Project, ProjectStage, ProjectCategory } from "@/lib/types";

export function useProjects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  // Fetch projects on mount
  useEffect(() => {
    const targetUserId = user?.id ?? process.env.NEXT_PUBLIC_PORTFOLIO_USER_ID;
    if (!targetUserId) return;

    const fetchProjects = async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("user_id", targetUserId)
        .order("order", { ascending: true });

      if (error) {
        setError(error.message);
      } else {
        setProjects(data as Project[]);
      }
      setLoading(false);
    };

    fetchProjects();
  }, [user?.id, supabase]);

  const addProject = useCallback(
    async (title: string, stage: ProjectStage, description: string = "", category: ProjectCategory = "website") => {
      if (!user) return;

      const stageProjects = projects.filter((p) => p.stage === stage);
      const maxOrder = stageProjects.reduce(
        (max, p) => Math.max(max, p.order),
        -1
      );

      const optimisticProject: Project = {
        id: crypto.randomUUID(),
        user_id: user.id,
        title,
        description,
        stage,
        category,
        order: maxOrder + 1,
        summary: "",
        tech_stack: [],
        files_built: [],
        key_decisions: [],
        lessons_learned: [],
        source_log_path: null,
        url: null,
        github_repo_url: null,
        content_hash: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      setProjects((prev) => [...prev, optimisticProject]);

      const { data, error } = await supabase
        .from("projects")
        .insert({
          user_id: user.id,
          title,
          description,
          stage,
          category,
          order: maxOrder + 1,
        })
        .select()
        .single();

      if (error) {
        // Rollback
        setProjects((prev) => prev.filter((p) => p.id !== optimisticProject.id));
        setError(error.message);
      } else {
        // Replace optimistic with real
        setProjects((prev) =>
          prev.map((p) => (p.id === optimisticProject.id ? (data as Project) : p))
        );
      }
    },
    [user, projects, supabase]
  );

  const moveProject = useCallback(
    async (id: string, targetStage: ProjectStage, targetIndex: number) => {
      setProjects((prev) => {
        const project = prev.find((p) => p.id === id);
        if (!project) return prev;

        const otherProjects = prev.filter((p) => p.id !== id);
        const targetStageProjects = otherProjects
          .filter((p) => p.stage === targetStage)
          .sort((a, b) => a.order - b.order);

        targetStageProjects.splice(targetIndex, 0, {
          ...project,
          stage: targetStage,
        });

        const reordered = targetStageProjects.map((p, i) => ({
          ...p,
          order: i,
        }));

        const remaining = otherProjects.filter(
          (p) => p.stage !== targetStage
        );

        return [...remaining, ...reordered];
      });

      // Persist: update the moved card and reorder siblings
      const updatedProjects = projects.filter(
        (p) => p.stage === targetStage || p.id === id
      );
      // We batch update in the background
      const project = projects.find((p) => p.id === id);
      if (!project) return;

      await supabase
        .from("projects")
        .update({ stage: targetStage, order: targetIndex })
        .eq("id", id);
    },
    [projects, supabase]
  );

  const updateProject = useCallback(
    async (id: string, updates: Partial<Project>) => {
      // Optimistic update
      setProjects((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, ...updates, updated_at: new Date().toISOString() } : p
        )
      );

      const { error } = await supabase
        .from("projects")
        .update(updates)
        .eq("id", id);

      if (error) {
        setError(error.message);
      }
    },
    [supabase]
  );

  const deleteProject = useCallback(
    async (id: string) => {
      const prev = projects;
      setProjects((p) => p.filter((proj) => proj.id !== id));

      const { error } = await supabase.from("projects").delete().eq("id", id);

      if (error) {
        setProjects(prev); // Rollback
        setError(error.message);
      }
    },
    [projects, supabase]
  );

  const getStageProjects = useCallback(
    (stage: ProjectStage) => {
      return projects
        .filter((p) => p.stage === stage)
        .sort((a, b) => a.order - b.order);
    },
    [projects]
  );

  const getCategoryProjects = useCallback(
    (category: ProjectCategory) => {
      return projects.filter((p) => p.category === category);
    },
    [projects]
  );

  return {
    projects,
    loading,
    error,
    addProject,
    moveProject,
    updateProject,
    deleteProject,
    getStageProjects,
    getCategoryProjects,
    // Aliases for backward compatibility with KanbanBoard props
    cards: projects,
    getColumnCards: getStageProjects,
    addCard: addProject,
    deleteCard: deleteProject,
    moveCard: moveProject,
  };
}
