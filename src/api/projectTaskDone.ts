import axiosClient from "./axiosClient";

export async function projectTaskDone(projectId: string, taskId: string) {
    const data = {
        status: "completed"
    };
    const res = await axiosClient.patch(`/projects/tasks/${projectId}/${taskId}`, data);
    return res.data.data;
}