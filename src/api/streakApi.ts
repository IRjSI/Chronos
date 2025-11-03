import axiosClient from "./axiosClient";

export async function getStreak() {
  const res = await axiosClient.get("/util/streak");
  return res.data.streak;
}