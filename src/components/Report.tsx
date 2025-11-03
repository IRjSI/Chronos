import { useEffect, useState } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { getReport } from "@/api/report";
import { getProgress } from "@/api/getProgress";
import { getStreak } from "@/api/streakApi";
import { Flame, Sparkle } from "lucide-react";
import { getDailyReport } from "@/api/dailyReport";
import { getSummary } from "@/api/getSummary";

interface IReport {
  avgProgress: number;
  completedTasks: number;
  createdTasks: number;
  totalProjects: number;
  dailyStats: any[];
  projectStats: any[];
  streak: number;
}

function WeeklyReport() {
  const [report, setReport] = useState<IReport>({
    avgProgress: 0,
    completedTasks: 0,
    createdTasks: 0,
    totalProjects: 0,
    dailyStats: [],
    projectStats: [],
    streak: 0,
  });

  const [summary, setSummary] = useState<string>("Generating your weekly insights...");

  const updateReport = async () => {
    const data = await getReport();
    const dailyData = await getDailyReport();
    const res = await getProgress();
    const streak = await getStreak();
    const report = { ...data, dailyStats: dailyData, projectStats: res, streak: streak };
    setReport(report);
    aiSummary(report);
  };

  const aiSummary = async (report: any) => {
    try {
      const res = await getSummary(report);
      if (res?.summary) setSummary(res.summary);
      else setSummary("Could not generate AI summary at the moment.");
    } catch (error) {
      console.error("AI Summary Error:", error);
      setSummary("Error generating summary.");
    }
  };

  useEffect(() => {
    updateReport();
  }, []);

  const completionRate = Math.round(
    (report.completedTasks / (report.createdTasks || 1)) * 100
  );

  return (
    <motion.div
      className="flex flex-col items-center px-6 py-12 gap-12 min-h-screen bg-background"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Title */}
      <h1 className="text-3xl font-semibold tracking-tight text-foreground">
        Weekly Report
      </h1>

      {/* Stats row */}
      <div className="flex flex-wrap justify-center items-center gap-12">
        {/* Circular Progress */}
        <div className="relative w-40 h-40">
          <CircularProgressbar
            value={completionRate}
            strokeWidth={6}
            styles={buildStyles({
              pathColor: "#000",
              trailColor: "",
              textColor: "",
            })}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-sm text-muted-foreground">
            <p className="text-xs uppercase tracking-wide">Completion</p>
            <p className="text-2xl font-semibold text-foreground">
              {completionRate}%
            </p>
            <p className="text-xs mt-1 opacity-70">
              {report.completedTasks}/{report.createdTasks}
            </p>
          </div>
        </div>

        {/* Streak */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex flex-col items-center justify-center"
        >
          <div className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-semibold shadow-sm">
            {report.streak}{" "}
            {report.streak >= 3 && (
              <Flame className="w-5 h-5 text-black dark:text-white" />
            )}
          </div>
          <p className="text-xs mt-2 text-muted-foreground uppercase tracking-wide">
            {report.streak > 1 ? "Days" : "Day"} Streak
          </p>
        </motion.div>

        {/* Overview */}
        <div className="flex flex-col gap-2 text-center">
          <p className="text-sm text-muted-foreground">Total Projects</p>
          <p className="text-xl font-semibold text-foreground">
            {report.totalProjects}
          </p>
          <p className="text-sm text-muted-foreground mt-3">Avg Progress</p>
          <p className="text-xl font-semibold text-foreground">
            {report.avgProgress}%
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-5xl">
        {/* Daily Trend */}
        <Card className="bg-card border-none shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-4">
              Task Trend (7 days)
            </h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart
                data={report.dailyStats.map((s) => ({
                  day: new Date(s.date).toLocaleDateString("en-US", { weekday: "short" }),
                  created: s.createdTasks,
                  completed: s.completedTasks,
                }))}
                margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" />
                <XAxis
                  dataKey="day"
                  stroke="#747474"
                  tickLine={false}
                  axisLine={{ stroke: "#d1d1d1" }}
                  tick={{ fontSize: 12 }}
                  interval={0}
                />
                <YAxis
                  stroke="#747474"
                  tickLine={false}
                  axisLine={{ stroke: "#d1d1d1" }}
                  tick={{ fontSize: 12 }}
                  width={30}
                />
                <Tooltip
                  cursor={{ stroke: "#d4d4d4", strokeDasharray: "3 3" }}
                  contentStyle={{
                    background: "#fff",
                    color: "#000",
                    border: "1px solid #e5e5e5",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="created"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={false}
                  name="Created Tasks"
                />
                <Line
                  type="monotone"
                  dataKey="completed"
                  stroke="hsl(var(--secondary))"
                  strokeWidth={2}
                  dot={false}
                  name="Completed Tasks"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Project Progress */}
        <Card className="bg-card border-none shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-4">
              Project Progress
            </h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart
                data={report.projectStats.map((p) => ({
                  name: p.title,
                  progress: p.progress,
                }))}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" />
                <XAxis
                  dataKey="name"
                  stroke="#747474"
                  tickLine={false}
                  axisLine={{ stroke: "#747474", strokeWidth: 1 }}
                  tickFormatter={(value) =>
                    value.length > 8 ? value.substring(0, 8) + "…" : value
                  }
                  interval={0}
                  padding={{ left: 10, right: 10 }}
                />
                <YAxis stroke="#747474" />
                <Tooltip
                  contentStyle={{
                    background: "#000",
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
                  }}
                />
                <Bar
                  dataKey="progress"
                  fill="hsl(var(--primary))"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* AI Summary */}
      <Card className="bg-card border-none shadow-sm w-full max-w-3xl">
        <CardContent className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center">
            <Sparkle /> AI Weekly Summary
          </h3>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-base leading-relaxed text-foreground"
          >
            {summary}
          </motion.p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default WeeklyReport;
