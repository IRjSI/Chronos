import axiosClient from "./axiosClient";

export async function getDailyReport() {
    const res = await axiosClient.get("/util/daily-report");
    return res.data.data;
}