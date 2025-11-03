import axiosClient from "./axiosClient";

export async function getTasks(category: string) {
    const res = await axiosClient.get(`/tasks?category=${category}`);
    return res.data.data;
}