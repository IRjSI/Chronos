import axiosClient from "./axiosClient";

export async function getProjects() {
    const res = await axiosClient.get(`/projects`);
    return res.data.data;
}