import axiosClient from "./axiosClient";

export async function getSummary(weeklyData: any) {
    const res = await axiosClient.post(`/util/summary`, weeklyData);
    return res.data;
}