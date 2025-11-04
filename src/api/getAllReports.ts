import { getReport } from "@/api/report";
import { getProgress } from "@/api/getProgress";
import { getStreak } from "@/api/streakApi";
import { getDailyReport } from "@/api/dailyReport";

export const getAllReports = async () => {
  const [data, dailyData, progress, streak] = await Promise.all([
    getReport(),
    getDailyReport(),
    getProgress(),
    getStreak(),
  ]);

  return {
    ...data,
    dailyStats: dailyData,
    projectStats: progress,
    streak,
  };
};