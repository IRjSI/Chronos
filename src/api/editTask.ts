import type { Key } from "react";
import axiosClient from "./axiosClient";

export async function editTask(id: Key) {
    const data = {
        status: "completed"
    };
    const res = await axiosClient.patch(`/tasks/${id}`, data);
    return res.data.data;
}