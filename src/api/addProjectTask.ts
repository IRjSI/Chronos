import axiosClient from "./axiosClient";

interface ITask {
  title: string;
  status?: string;
  description?: string;
  dueDate: string;
  projectId?: {
    title: string
  }
}

export async function addProjectTask(task: ITask, projectId: string) {
  const res = await axiosClient.post(`/projects/tasks/${projectId}`, task);
  return res.data.data;
}