import { NavLink } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Calendar28 } from "@/components/DatePicker";
import ProfileButton from "@/components/ProfileButton";
import { addTask } from "@/api/addTask";
import { addProject } from "@/api/addProject";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface ITask {
  title: string;
  description: string;
  category: string;
  dueDate: string;
}

interface IProject {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
}

export function HeaderSection() {
  const [task, setTask] = useState({
    title: "",
    description: "",
    category: "life",
    dueDate: "",
  });

  const [project, setProject] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
  });

  const handleChange = (setState: any) => (e: any) => {
    const { name, value } = e.target;
    setState((prev: any) => ({ ...prev, [name]: value }));
  };

  const queryClient = useQueryClient();

  const addTaskMutation = useMutation({
    mutationFn: (task: ITask) => addTask(task),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["homeData", task.category] });
    },
  })

  const addProjectMutation = useMutation({
    mutationFn: (project: IProject) => addProject(project),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["homeData"] });
    },
  })

  const addTaskCall = async () => {
    if (!task.title) return;
    await addTaskMutation.mutateAsync(task)
    setTask({ title: "", description: "", category: "", dueDate: "" });
  };

  
  const addProjectCall = async () => {
    if (!project.title) return;
    await addProjectMutation.mutateAsync(project);
    setProject({ title: "", description: "", startDate: "", endDate: "" });
  };

  return (
    <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
      <div>
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Chronos</h1>
        <p className="text-sm text-slate-500">Calm dashboard for habits & progress</p>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <NavLink to="/projects" className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm hover:opacity-90 shadow-sm">
          Projects
        </NavLink>

        {/* Project Dialog */}
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
              <Input name="title" placeholder="Title" value={project.title} onChange={handleChange(setProject)} />
              <Input name="description" placeholder="Description" value={project.description} onChange={handleChange(setProject)} />
              <Calendar28
                label="Start Date"
                value={project.startDate}
                onChange={(date: Date) =>
                setProject((prev: any) => ({
                    ...prev,
                    startDate: date.toISOString(),
                }))
                }
            />
            <Calendar28
                label="End Date"
                value={project.endDate}
                onChange={(date: Date) =>
                setProject((prev: any) => ({
                    ...prev,
                    endDate: date.toISOString(),
                }))
                }
            />
            </div>
            <button className="mt-3 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm" onClick={addProjectCall}>
              Add
            </button>
          </DialogContent>
        </Dialog>

        {/* Task Dialog */}
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
              <Input name="title" placeholder="Task" value={task.title} onChange={handleChange(setTask)} />
              <Input name="description" placeholder="Description" value={task.description} onChange={handleChange(setTask)} />
              <Calendar28
                label="Due Date"
                value={task.dueDate}
                onChange={(date: Date) =>
                setTask((prev: any) => ({
                    ...prev,
                    dueDate: date.toISOString(),
                }))
                }
              />
            </div>
            <button className="mt-3 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm" onClick={addTaskCall}>
              Add
            </button>
          </DialogContent>
        </Dialog>

        <ProfileButton />
      </div>
    </header>
  );
};