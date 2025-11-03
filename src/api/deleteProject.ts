import type { Key } from "react";
import axiosClient from "./axiosClient";

export async function deleteProject(id: Key) {
    const res = await axiosClient.delete(`/projects/${id}`);
    return res.data.data;
}