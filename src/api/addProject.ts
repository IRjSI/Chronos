import axiosClient from "./axiosClient";

interface IProject {
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
}

export async function addProject(project: IProject) {
    const res = await axiosClient.post(`/projects`, project);
    return res.data.data;
}