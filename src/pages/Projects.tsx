import React, { useEffect, useState, type Key } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Calendar28 } from "@/components/DatePicker";
import { IconFolderCode } from "@tabler/icons-react";
import { Progress } from "@/components/ui/progress";
import { getProgress } from "@/api/getProgress";

interface IProject {
  _id: Key;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
}

interface ITask {
  _id: Key;
  title: string;
  description?: string;
  status?: string;
  dueDate: string;
}

export default function Projects() {

  const [projects, setProjects] = useState<IProject[]>([]);
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Record<string, ITask[]>>({});
  const [project, setProject] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
  });
  const [task, setTask] = useState({
    title: "",
    description: "",
    dueDate: "",
  });

  const [progressMap, setProgressMap] = useState<Record<string, number>>({});

  // handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProject((prev) => ({ ...prev, [name]: value }));
  };

  const handleTaskChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTask((prev) => ({ ...prev, [name]: value }));
  };

  // get all projects
  const getProjects = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/projects`, {
        withCredentials: true,
      });
      setProjects(res.data.data || []);
    } catch (err) {
      console.error("Error fetching projects:", err);
    }
  };

  // get tasks for one project
  const getTasks = async (projectId: string) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/projects/tasks/${projectId}`,
        { withCredentials: true }
      );
      setTasks((prev) => ({ ...prev, [projectId]: res.data.data.projectTasks || [] }));

      setProgressMap((prev) => ({
        ...prev,
        [projectId]: res.data.data.projectProgress.progress,
      }));
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  // add project
  const addProject = async () => {
    if (!project.title) return;
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/projects`, project, {
        withCredentials: true,
      });
      await getProjects();
      setProject({ title: "", description: "", startDate: "", endDate: "" });
    } catch (err) {
      console.error("Error adding project:", err);
    }
  };

  // delete project
  const deleteProject = async (projectId: Key) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/projects/${projectId}`, {
        withCredentials: true,
      });
      setProjects((prev) => prev.filter((p) => p._id !== projectId));
    } catch (err) {
      console.error("Error deleting project:", err);
    }
  };

  // add task
  const addTask = async (projectId: string) => {
    if (!task.title) return;
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/projects/tasks/${projectId}`,
        task,
        { withCredentials: true }
      );

      setTask({ title: "", description: "", dueDate: "" });
      setProgressMap((prev) => ({
        ...prev,
        [projectId]: res.data.data.progress,
      }));
      await getTasks(projectId);
    } catch (err) {
      console.error("Error adding task:", err);
    }
  };

  const taskDone = async (projectId: string, taskId: string) => {
    const res = await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/projects/tasks/${projectId}/${taskId}`, { status: "completed" }, {
      withCredentials: true,
    });
    setProgressMap((prev) => ({
      ...prev,
      [projectId]: res.data.data.progress,
    }));
    await getTasks(projectId);
  }

  // delete task
  const deleteTask = async (projectId: string, taskId: string) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/projects/tasks/${taskId}`,
        { withCredentials: true }
      );
      await getTasks(projectId);
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  // get progress for every project
  const updateProgress = async () => {
    try {
      const res = await getProgress(); // array
      for (let i = 0; i < res.length; i++) {
        setProgressMap((prev) => ({
          ...prev,
          [res[i]._id]: res[i].progress,
        }));
      }
    } catch (error) {
      
    }
  };

  // toggle project expansion
  const toggleProject = async (projectId: string) => {
    if (expandedProjectId === projectId) {
      setExpandedProjectId(null);
    } else {
      setExpandedProjectId(projectId);
      await getTasks(projectId);
    }
  };

  useEffect(() => {
    getProjects();
    updateProgress();
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 p-6 md:p-10">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-2xl shadow-sm">
        {/* Header */}
        <header className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold">Projects</h1>
            <p className="text-sm text-slate-500">
              View and manage all your projects
            </p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>+ Add Project</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>New Project</DialogTitle>
                <DialogDescription>
                  Define your project details below.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-2">
                <Input
                  name="title"
                  placeholder="Project title"
                  value={project.title}
                  onChange={handleChange}
                />
                <Input
                  name="description"
                  placeholder="Description"
                  value={project.description}
                  onChange={handleChange}
                />
                <Calendar28
                  label="Start Date"
                  value={project.startDate}
                  onChange={(date: Date) =>
                    setProject((p) => ({
                      ...p,
                      startDate: date.toISOString(),
                    }))
                  }
                />
                <Calendar28
                  label="End Date"
                  value={project.endDate}
                  onChange={(date: Date) =>
                    setProject((p) => ({
                      ...p,
                      endDate: date.toISOString(),
                    }))
                  }
                />
              </div>
              <Button className="mt-3 w-full" onClick={addProject}>
                Add Project
              </Button>
            </DialogContent>
          </Dialog>
        </header>

        {/* Projects */}
        <ScrollArea className="h-[70vh]">
          {projects.length === 0 ? (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <IconFolderCode />
                </EmptyMedia>
                <EmptyTitle>No projects</EmptyTitle>
                <EmptyDescription>No projects found</EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>Add Project</Button>
                  </DialogTrigger>
                </Dialog>
              </EmptyContent>
            </Empty>
          ) : (
            projects.map((p) => (
              <motion.div
                key={p._id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="p-4 mb-3 rounded-xl border border-slate-100 hover:bg-slate-50"
              >
                <div className="flex justify-between items-start">
                  <div
                    onClick={() => toggleProject(p._id as string)}
                    className="cursor-pointer"
                  >
                    <div className="font-medium">{p.title}</div>
                    <p className="text-sm text-slate-600">{p.description}</p>
                    <p className="text-xs text-slate-400 mt-1">
                      {new Date(p.startDate).toDateString()} →{" "}
                      {new Date(p.endDate).toDateString()}
                    </p>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div>
                            <Progress className="mt-2" value={progressMap[p._id as string] || 0} />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Progress: {progressMap[p._id as string] || 0}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Button
                    onClick={() => deleteProject(p._id)}
                    className="bg-red-500/10 text-red-500 hover:bg-red-500/20"
                  >
                    Delete
                  </Button>
                </div>

                {/* Expanded Tasks */}
                {expandedProjectId === p._id && (
                  <div className="mt-4 pl-4 border-l-2 border-slate-200">
                    {tasks[p._id as string]?.length ? (
                      <ul className="space-y-2">
                        {tasks[p._id as string].map((t) => (
                          <li
                            key={t._id}
                            className={`flex justify-between items-center border p-2 rounded-lg ${t.status === "completed" && "border-green-200 bg-green-200/5"}`}
                          >
                            <div>
                              <p className="font-medium">{t.title}</p>
                              <p className="text-sm text-slate-600">
                                {t.description}
                              </p>
                              <p className="text-xs text-slate-400">
                                Due: {new Date(t.dueDate).toDateString()}
                              </p>
                            </div>
                            
                            <div className="flex items-center justify-center">
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    taskDone(p._id as string, t._id as string)
                                  }
                                  disabled={t.status === "completed"}
                                >
                                  {t.status === "completed" ? "Done" : "Mark"}
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-500"
                                  onClick={() =>
                                    deleteTask(p._id as string, t._id as string)
                                  }
                                >
                                  Delete
                              </Button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-slate-500">
                        No tasks added yet.
                      </p>
                    )}

                    {/* Add Task Dialog */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="mt-3">+ Add Task</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add Task to {p.title}</DialogTitle>
                          <DialogDescription>
                            Break your big project into smaller goals.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-2">
                          <Input
                            name="title"
                            placeholder="Task title"
                            value={task.title}
                            onChange={handleTaskChange}
                          />
                          <Input
                            name="description"
                            placeholder="Description"
                            value={task.description}
                            onChange={handleTaskChange}
                          />
                          <Calendar28
                            label="Due Date"
                            value={task.dueDate}
                            onChange={(date: Date) =>
                              setTask((t) => ({
                                ...t,
                                dueDate: date.toISOString(),
                              }))
                            }
                          />
                        </div>
                        <Button
                          className="mt-3 w-full"
                          onClick={() => addTask(p._id as string)}
                        >
                          Add Task
                        </Button>
                      </DialogContent>
                    </Dialog>
                  </div>
                )}
              </motion.div>
            ))
          )}
        </ScrollArea>
      </div>
    </main>
  );
}
