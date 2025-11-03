import axiosClient from "./axiosClient";

export async function getReport() {
    const res = await axiosClient.get("/util/report");
    return res.data.data;
}