import type { Key } from "react";
import axiosClient from "./axiosClient";

export async function deleteTask(id: Key) {
    const res = await axiosClient.delete(`/tasks/${id}`);
    return res.data.data;
}