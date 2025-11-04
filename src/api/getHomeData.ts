import { getCompletedTasks } from "./completedTasks";
import { getProgress } from "./getProgress";
import { getProjects } from "./getProject"
import { getTasks } from "./getTasks"
import { getStreak } from "./streakApi";

export const getHomeData = async (category?: string) => {
    const [projects, tasks, completedTasks, streak, progress] = await Promise.all([
        getProjects(),
        getTasks(category ? category : "all"),
        getCompletedTasks(),
        getStreak(),
        getProgress(),
    ]);

    return {
        projects,
        tasks,
        completedTasks,
        streak,
        progress,
    };
};