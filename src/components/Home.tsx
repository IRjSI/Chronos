import { useState, type Key } from "react";
import { useAuth } from "../context/AuthContext";
import { getHomeData } from "@/api/getHomeData";
import HomeSkeleton from "./skeleton/HomeSkeleton";
import { HeaderSection } from "./HeaderSection";
import { FilterSection } from "./FilterSection";
import { OverviewSection } from "./OverviewSection";
import { TasksSection } from "./TasksSection";
import { ProjectsSection } from "./ProjectsSection";
import { CommentsSection } from "./CommentsSection";
import { useQuery } from "@tanstack/react-query";

interface IState {
  _id: number;
  label: string;
  value: string | number;
}

export interface ITask {
  _id: Key;
  title: string;
  status?: string;
  description?: string;
  dueDate: string;
  projectId?: {
    title: string
  }
}

export interface IProject {
  _id: Key;
  title: string;
  description?: string;
  progress: number;
  startDate: string;
  endDate: string;
}

export default function Home() {
  const { user, loading } = useAuth();

  const [category, setCategory] = useState("all");

  const { data, isLoading } = useQuery({
    queryKey: ["homeData", category],
    queryFn: () => getHomeData(category),
    enabled: !!user && !loading
  });

  const homeData = data || {
    tasks: [],
    projects: [],
    completedTasks: 0, 
    streak: 0
  }

  const { tasks, projects, completedTasks, streak } = homeData;

  const [content, setContent] = useState("");
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(null);

  const stats: IState[] = [
    { _id: 1, label: tasks.length > 1 ? "Tasks" : "Task", value: tasks.length },
    { _id: 2, label: projects.length > 1 ? "Projects" : "Project", value: projects.length },
    { _id: 3, label: "Streak", value: `${streak}${streak >= 3 ? "🔥" : ""}` },
  ];

  if (!user) return <div className="p-6 text-slate-500">Please log in</div>;
  if (isLoading) return (
    <HomeSkeleton />
  );

  return (
  <main className="min-h-screen bg-slate-50 text-slate-900 p-6 md:p-10">
    <div className="max-w-7xl mx-auto">
      {/* HEADER */}
      <HeaderSection />

      {/* FILTER */}
      <FilterSection category={category} setCategory={setCategory} />

      {/* MAIN GRID LAYOUT */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT — OVERVIEW + TASKS */}
        <aside className="space-y-6">
          {/* OVERVIEW SECTION */}
          <OverviewSection stats={stats} />

          {/* TASKS SECTION */}
          <TasksSection category={category} completedTasks={completedTasks} tasks={tasks} />
        </aside>

        {/* MIDDLE — PROJECTS */}
        <ProjectsSection expandedProjectId={expandedProjectId} setExpandedProjectId={setExpandedProjectId} projects={projects} />

        {/* RIGHT — COMMENTS PANEL */}
        <CommentsSection content={content} setContent={setContent} expandedProjectId={expandedProjectId!} user={user} loading={loading} />
      </section>

      <footer className="mt-8 text-center text-xs text-slate-400">
        Built with focus — minimal, modern, and intentionally calm.
      </footer>
    </div>
  </main>
);

}