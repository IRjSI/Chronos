import { motion } from "framer-motion";
import { useEffect, useState, type Key } from "react";
import { useAuth } from "../context/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Calendar28 } from "./DatePicker";
import { Link, NavLink } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import Streak from "./Streak";
import { getStreak } from "@/api/streakApi";
import { getTasks } from "@/api/getTasks";
import { editTask } from "@/api/editTask";
import { getProjects } from "@/api/getProject";
import { addTask } from "@/api/addTask";
import { addProject } from "@/api/addProject";
import { deleteTask } from "@/api/deleteTask";
import { deleteProject } from "@/api/deleteProject";
import ProfileButton from "./ProfileButton";
import { getCompletedTasks } from "@/api/completedTasks";
import { getProgress } from "@/api/getProgress";

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
  startDate: string;
  endDate: string;
}

export default function Home() {
  const { user, loading } = useAuth();

  const [tasks, setTasks] = useState<ITask[]>([]);
  const [projects, setProjects] = useState<IProject[]>([]);
  const [stats, setStats] = useState<IState[]>([]);

  const [done, setDone] = useState(0);
  const [total, setTotal] = useState(0);
  const [streak, setStreak] = useState<number | null>(null);

  const [task, setTask] = useState({
    title: "",
    description: "",
    category: "",
    dueDate: "",
  });

  const [project, setProject] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
  });

  const [progress, setProgress] = useState<Record<string, number>>({});

  const handleChange = (setState: any) => (e: any) => {
    const { name, value } = e.target;
    setState((prev: any) => ({ ...prev, [name]: value }));
  };

  const [category, setCategory] = useState("all");
  
  const completedTasks = async () => {
    try {
      const done = await getCompletedTasks();
      setDone(done);
    } catch (error) {
      
    }
  }

  const getTasksCall = async () => {
    try {
      const res = await getTasks(category);
      setTasks(res || []);
      setTotal(res.length);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  const taskDone = async (id: Key) => {
    await editTask(id);
    getTasksCall();
  }

  const getProjectsCall = async () => {
    try {
      const res = await getProjects();
      setProjects(res || []);
    } catch (err) {
      console.error("Error fetching projects:", err);
    }
  };

  const addTaskCall = async () => {
    if (!task.title) return;
    try {
      await addTask(task);
      await getTasksCall();
      setTask({ title: "", description: "", category: "", dueDate: "" });
    } catch (err) {
      console.error("Error adding task:", err);
    }
  };

  const addProjectCall = async () => {
    if (!project.title) return;
    try {
      await addProject(project);
      await getProjectsCall();
      setProject({ title: "", description: "", startDate: "", endDate: "" });
    } catch (err) {
      console.error("Error adding project:", err);
    }
  };

  const deleteTaskCall = async (id: Key) => {
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  const deleteProjectCall = async (id: Key) => {
    try {
      await deleteProject(id);
      setProjects((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Error deleting project:", err);
    }
  };

  // const editTask = async (id: Key, data: any) => {
  //   try {
  //     await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/tasks/${id}`, data, {
  //       withCredentials: true,
  //     });
  //     getTasks();
  //   } catch (err) {
  //     console.error("Error editing task:", err);
  //   }
  // };

  const dueDatePassed = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);

    if (date.getTime() < today.getTime()) {
      return -1;
    } else if (date.getTime() === today.getTime()) {
      return 0;
    }
    return 1;
  };

  const updateStreak = async () => {
    const streak = await getStreak();
    setStreak(streak);
  }

  const updateProgress = async () => {
    const res = await getProgress();
    for (let i = 0; i < res.length; i++) {
      setProgress((prev) => ({...prev, [res[i]._id]: res[i].progress}))
    }
  }

  useEffect(() => {
    setStats([
      { _id: 1, label: tasks.length > 1 ? "Tasks" : "Task", value: tasks.length },
      { _id: 2, label: projects.length > 1 ? "Projects" : "Project", value: projects.length },
      { _id: 3, label: "Streak", value: `${streak}${streak && streak >= 3 ? "🔥" : ""}` },
    ]);
  }, [streak, tasks, projects]);

  useEffect(() => {
    if (!loading && user) {
      getTasksCall();
      getProjectsCall();
      updateStreak();
      completedTasks();
      updateProgress();
    }
  }, [user, loading, category, done, total]);

  if (!user) return <div className="p-6 text-slate-500">Please log in</div>;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Chronos</h1>
            <p className="text-sm text-slate-500">Calm dashboard for habits & progress</p>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex items-center gap-4">
            <NavLink to={"/projects"} className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm shadow-sm hover:opacity-95">Projects</NavLink>
            {/* PROJECT DIALOG */}
            <Dialog>
              <DialogTrigger className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm shadow-sm hover:opacity-95">
                + Project
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Define your Project</DialogTitle>
                  <DialogDescription>Kal kare so aaj kar...</DialogDescription>
                </DialogHeader>
                <div className="grid gap-2">
                  <Input name="title" placeholder="title" value={project.title} onChange={handleChange(setProject)} />
                  <Input name="description" placeholder="describe your project" value={project.description} onChange={handleChange(setProject)} />
                  <Calendar28 label="Start Date" value={project.startDate} onChange={(date: Date) => setProject((prev) => ({ ...prev, startDate: date.toISOString() }))} />
                  <Calendar28 label="End Date" value={project.endDate} onChange={(date: Date) => setProject((prev) => ({ ...prev, endDate: date.toISOString() }))} />
                </div>
                <button className="mt-3 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm" onClick={addProjectCall}>
                  Add
                </button>
              </DialogContent>
            </Dialog>

            {/* TASK DIALOG */}
            <Dialog>
              <DialogTrigger className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm shadow-sm hover:opacity-95">
                + Task
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Define your Task</DialogTitle>
                  <DialogDescription>Kal kare so aaj kar...</DialogDescription>
                </DialogHeader>
                <div className="grid gap-2">
                  <Input name="title" placeholder="task" value={task.title} onChange={handleChange(setTask)} />
                  <Input name="description" placeholder="describe" value={task.description} onChange={handleChange(setTask)} />
                  <Select name="category" onValueChange={(value) => {setTask(prev => ({ ...prev, category: value}))}}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="life">life</SelectItem>
                      <SelectItem value="health">health</SelectItem>
                      <SelectItem value="academic">academic</SelectItem>
                      <SelectItem value="hobby">hobby</SelectItem>
                    </SelectContent>
                  </Select>
                  <Calendar28 label="Due Date" value={task.dueDate} onChange={(date: Date) => setTask((prev) => ({ ...prev, dueDate: date.toISOString() }))} />
                </div>
                <button className="mt-3 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm" onClick={addTaskCall}>
                  Add
                </button>
              </DialogContent>
            </Dialog>

            <ProfileButton />
          </div>
        </header>

        {/* FILTER */}
        <section className="mb-8">
          <div className="flex flex-wrap items-center gap-3">
            {["all", "life", "health", "academics", "hobby"].map((c) => (
              <button
                key={c}
                className={`px-3 py-1 rounded-full text-sm transition-all border ${
                  c === category
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
                onClick={() => setCategory(c)}
              >
                {c}
              </button>
            ))}
          <Streak />
          </div>

        </section>

        {/* CONTENT */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* SIDEBAR */}
          <aside className="space-y-4">
            {/* Overview */}
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="rounded-2xl bg-white p-5 shadow-sm"
            >
              <h2 className="text-sm font-medium text-slate-600 mb-4">Overview</h2>
              <div className="grid grid-cols-3 gap-3">
                {stats.map((s) => (
                  <div key={s._id} className="p-3 bg-slate-50 rounded-lg text-center">
                    <div className="text-lg font-semibold">{s.value}</div>
                    <div className="text-xs text-slate-500 mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.section
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="rounded-2xl bg-white p-6 shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Tasks</h2>
                <div>({done}/{total})</div>
                <div className="text-sm text-slate-500">{tasks.length} items</div>
              </div>

              <ul className="space-y-3">
                {tasks.length === 0 ? (
                  <p className="text-xs text-slate-400">No tasks found.</p>
                ) : (
                  tasks.map((t) => (
                    <li
                      key={t._id}
                      className="relative flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:bg-slate-50"
                    >
                      <div>
                        <div className="font-medium">{t.title} {t.projectId && <Badge variant="secondary">{t.projectId.title}</Badge>} {dueDatePassed(new Date(t.dueDate)) === 0 && (
                          <Badge variant="secondary">due today</Badge>
                        )}</div>
                        <div className="text-sm text-slate-600 font-sm">{t.description}</div>
                        <div className={`text-xs ${dueDatePassed(new Date(t.dueDate)) === -1 ? "text-red-800 line-through" : dueDatePassed(new Date(t.dueDate)) === 0 ? "text-yellow-800" : "text-slate-400"}`}>
                          Due • {new Date(t.dueDate).toDateString()}
                        </div>
                      </div>
                      
                      <div className="flex-col items-center justify-between text-center">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => deleteTaskCall(t._id)}
                            className="px-3 py-1 text-xs rounded-md border border-slate-200 text-red-600"
                            >
                            Delete
                          </button>
                          <button
                            onClick={() => {
                              taskDone(t._id)
                            }}
                            className="px-3 py-1 text-xs rounded-md bg-slate-900 text-white"
                            >
                            Done
                          </button>
                        </div>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div
                              className={`absolute bottom-2 right-2 w-1.5 h-1.5 rounded-full cursor-pointer ${
                                t.status === "completed" ? "bg-green-500" : "bg-yellow-400"
                              }`}
                            />
                          </TooltipTrigger>
                          <TooltipContent side="right">
                            <p className="capitalize">{t.status}</p>
                          </TooltipContent>
                        </Tooltip>
                                      
                      </div>
                    </li>
                  ))
                )}
              </ul>
            </motion.section>
          </aside>

          {/* Projects */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, duration: 0.35 }}
            className="rounded-2xl bg-white p-5 shadow-sm"
          >
            <h3 className="text-sm font-medium text-slate-600 mb-3">Active Projects</h3>
            <div className="space-y-3">
              {projects.length === 0 ? (
                <p className="text-xs text-slate-400">No projects yet.</p>
              ) : (
                projects.map((p) => (
                  <div key={p._id} className="flex items-center justify-between">
                    <div>
                      <Link to={"/projects"}>
                        <div className="text-md font-semibold">{p.title}</div>
                        <div className="text-sm text-slate-600 font-sm">{p.description}</div>
                        <div className="text-xs text-slate-400">{new Date(p.startDate).toDateString()} - {new Date(p.endDate).toDateString()}</div>
                      </Link>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div>
                              <Progress className="mt-2" value={progress[p._id as string]} />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Progress: {progress[p._id as string]}%</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <button
                      onClick={() => deleteProjectCall(p._id)}
                      className="text-xs text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </section>

        <footer className="mt-8 text-center text-xs text-slate-400">
          Built with focus — minimal, modern, and intentionally calm.
        </footer>
      </div>
    </main>
  );
}
