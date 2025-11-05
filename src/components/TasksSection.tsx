import { motion } from "framer-motion";
import type { ITask } from "@/types";
import { Badge } from "@/components/ui/badge";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTask } from "@/api/deleteTask";
import { editTask } from "@/api/editTask";

interface Props {
  category: string;
  tasks: ITask[];
  completedTasks: number;
}

export function TasksSection({ category, tasks, completedTasks }: Props) {
  const queryClient = useQueryClient();

  const dueDatePassed = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    if (date < today) return -1;
    if (date.getTime() === today.getTime()) return 0;
    return 1;
  };

  const deleteTaskMutation = useMutation({
    mutationFn: (taskId: string) => deleteTask(taskId),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["homeData", category] });
    },
  });

  const doneTaskMutation = useMutation({
    mutationFn: (taskId: string) => editTask(taskId),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["homeData", category] });
    },
  });

  const handleDeleteTask = async (id: string) => {
    await deleteTaskMutation.mutateAsync(id);
  };

  const handleDoneTask = async (id: string) => {
    await doneTaskMutation.mutateAsync(id);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05, duration: 0.35 }}
      className="rounded-2xl bg-white p-5 shadow-sm"
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-slate-600">Tasks</h3>
        <span className="text-xs text-slate-500">
          {completedTasks}/{tasks.length} done
        </span>
      </div>

      {tasks.length === 0 ? (
        <p className="text-xs text-slate-400">No tasks found.</p>
      ) : (
        <ul className="space-y-3">
          {tasks.map((t) => (
            <li
              key={t._id}
              className="rounded-xl border border-slate-100 p-4 hover:shadow-sm transition-all flex items-start justify-between"
            >
              <div>
                <div className="font-semibold text-slate-900 flex items-center gap-2">
                  {t.title}
                  {t.projectId?.title && (
                    <Badge variant="secondary">{t.projectId.title}</Badge>
                  )}
                </div>
                {t.description && (
                  <div className="text-sm text-slate-600">{t.description}</div>
                )}
                <div
                  className={`text-xs ${
                    dueDatePassed(new Date(t.dueDate)) === -1
                      ? "text-red-700 line-through"
                      : dueDatePassed(new Date(t.dueDate)) === 0
                      ? "text-yellow-700"
                      : "text-slate-400"
                  }`}
                >
                  Due • {new Date(t.dueDate).toDateString()}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleDeleteTask(t._id as string)}
                  className="px-3 py-1 text-xs rounded-md border border-slate-200 text-red-600"
                  disabled={deleteTaskMutation.isPending}
                >
                  {deleteTaskMutation.isPending ? "Deleting..." : "Delete"}
                </button>
                <button
                  onClick={() => handleDoneTask(t._id as string)}
                  className="px-3 py-1 text-xs rounded-md bg-slate-900 text-white"
                  disabled={doneTaskMutation.isPending}
                >
                  {doneTaskMutation.isPending ? "Marking..." : "Done"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </motion.section>
  );
}
