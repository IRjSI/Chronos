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

export async function addTask(task: ITask) {
    const res = await axiosClient.post(`/tasks`, task);
    return res.data.data;
}