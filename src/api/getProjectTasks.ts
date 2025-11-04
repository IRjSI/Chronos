import axiosClient from "./axiosClient";

export async function getProjectTasks(projectId: string) {
    const res = await axiosClient.get(`/projects/tasks/${projectId}`);
    return res.data.data.projectTasks;
}