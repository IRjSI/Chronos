import axiosClient from "./axiosClient";

export async function getProgress() {
    const res = await axiosClient.get(`/util/progress`);
    return res.data.progress;
}