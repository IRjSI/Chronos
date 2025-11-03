import axiosClient from "./axiosClient";

export async function getCompletedTasks() {
    const res = await axiosClient.get(`/util/completed-tasks`);
    return res.data.length;
}