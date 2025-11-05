import { motion } from "framer-motion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import type { IProject } from "@/types";
import { deleteProject } from "@/api/deleteProject";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface Props {
  expandedProjectId: string | null;
  setExpandedProjectId: (id: string | null) => void;
  projects: IProject[];
}

export function ProjectsSection({ expandedProjectId, setExpandedProjectId, projects }: Props) {
    
    const queryClient = useQueryClient();

    const deleteProjectMutation = useMutation({
        mutationFn: (id: string) => deleteProject(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["homeData"] });
        },
    });

    const handleDeleteProject = async (id: string) => {
        await deleteProjectMutation.mutateAsync(id);
    };

  return (
    <motion.section
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05, duration: 0.35 }}
        className="rounded-2xl bg-white p-5 shadow-sm"
    >
        <h3 className="text-sm font-medium text-slate-600 mb-3">
            Active Projects
        </h3>

        <div className="space-y-4">
            {projects.length === 0 ? (
            <p className="text-xs text-slate-400">No projects yet.</p>
            ) : (
            projects.map((p: IProject) => (
                <div
                key={p._id}
                className={`rounded-xl border ${
                    expandedProjectId === p._id ? "bg-gray-100" : ""
                } border-slate-100 p-4 hover:shadow-sm transition-all`}
                >
                <div className="flex items-start justify-between">
                    <div
                        className="flex-1 cursor-pointer"
                        onClick={() => setExpandedProjectId(p._id as string)}
                    >
                    {/* <Link to="/projects"> */}
                    <div className="text-md font-semibold">{p.title}</div>
                    <div className="text-sm text-slate-600">{p.description}</div>
                    <div className="text-xs text-slate-400">
                        {new Date(p.startDate).toDateString()} —{" "}
                        {new Date(p.endDate).toDateString()}
                    </div>
                    {/* </Link> */}

                    <TooltipProvider>
                        <Tooltip>
                        <TooltipTrigger asChild>
                            <div>
                            <Progress className="mt-2" value={p.progress} />
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Progress: {p.progress}%</p>
                        </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    </div>

                    <button
                        onClick={() => handleDeleteProject(p._id as string)}
                        className="text-xs text-red-500 hover:underline"
                    >
                        Delete
                    </button>
                </div>
                </div>
            ))
            )}
        </div>
        </motion.section>

  );
};